function GameLogic(){
  /// 0 = Decision Mode
  /// 1 = Movement Mode
  this.stage = 0;

  // Decision Stage:
  // For prototype
  // 0 = movements
  // 1 = attack

  this.level = 1;
  this.turn = 1;
  this.timePerTurn = 100;
  this.turnStart = Date.now();
  this.playerKP = 0;
  this.AIKP = 0;

  this.init();


  this.arrows = new Array();
  this.actionPointer = 0;
  this.AIPointer = 0;

  this.boxes = new Array();

  this.curPosX = hero.posX;
  this.curPosY = hero.posY;

  this.futureX = this.curPosX;
  this.futureY = this.curPosY;

  this.tick = 0;
  this.lastKeyTick = 0;
  this.lastMoveTick = 0;
  this.moveInterval = 20;
  this.keyInterval = 10;


  /// Temp:


  this.arrows.clear = function() {
    for (var i=0; i<this.length; i++) {
      this[i].shutdown();
    }
    this.splice(0, this.length);
  };


  
  this.boxes.clear = function() {
    for (var i=0; i<this.length; i++ ){
      this[i].shutdown();
    }
    this.splice( 0, this.length );
  };

  
  this.arrows.dequeue = function() {
    this[0].shutdown();
    return this.splice(0, 1)[0];
  };
  
  this.go = function(){
    if ( this.tick - this.lastKeyTick > this.keyInterval ){
      this.stage = 1;
      this.lastKeyTick = this.tick;
      this.lastMoveTick = this.tick;
      this.actionPointer = 0;
    }
  };

  this.clear = function(){
    actions.reset();
    actionsAI.reset();
    streams.reset();
    this.arrows.clear();
    this.boxes.clear();
  };

  this.eventStack = new Array(0);


  this.dispatchEvent = function( e ){
    this.eventStack.push(e);
  };

  this.update = function(){
    this.tick ++;


    // Event Process
    while ( this.eventStack.length > 0 ){
      e = this.eventStack.pop();
      if ( "Player Kill" == e.name ){
	this.playerKP++;
      } else if ( "AI Kill" == e.name ){
	this.AIKP++;
      } else if ( "Clear" == e.name ){
	this.clear();
      } else if ( "To Decision Mode" == e.name ){
	this.stage = 0;
	this.turn ++; 
	this.turnStart = Date.now();
	this.clear();
	hero.updateCoolDown();
	enemy.updateCoolDown();
      } else if ( "Actions Update" == e.name ) {
	/// Update Arrows and Boxes
	if ( this.stage != 0 ) {
	  continue;
	}
	this.arrows.clear();
	this.boxes.clear();
	if (actions.len > 0){
	  var posX = hero.posX;
	  var posY = hero.posY;
	  var posX0 = 0;
	  var posY0 = 0;
	  for ( var i=0; i<actions.len; i++ ){
	    posX0 = posX + board.dx[actions.actions[i].code];
	    posY0 = posY + board.dy[actions.actions[i].code];
	    if (actions.actions[i].code >= 10) {
	      var id = actions.actions[i].code - 10;
	      var caster = { posX: posX, posY: posY };
	      atkStyles[id].generate( caster );
	      for ( var j=0; j<atkStyles[id].targets.length; j++ ) {
		this.boxes.push(
		  new TargetBox(
		    atkStyles[id].targets[j].posX,
		    atkStyles[id].targets[j].posY
		  ));
	      }
	    }
	    else if(board.inBoard( posX0, posY0 ) && 0 == board.map[posY0][posX0] ) {
	      posX = posX0;
	      posY = posY0;
	      this.arrows.push(new Arrow(posX, posY, actions.actions[i].code));
	    }
	  }
	  this.futureX = posX;
	  this.futureY = posY;
	}
      } else if ( "To Action Mode" == e.name ) {
	this.stage = 1;
	this.lastKeyTick = this.tick;
	this.lastMoveTick = this.tick;
	this.actionPointer = 0;
	this.AIPointer = 0;
	enemy.think();
      }
    }

    /**
     *  Action Mode
     */
    if ( this.stage == 1 ){
      if ( this.tick - this.lastMoveTick > this.moveInterval ) {
	var doneCount = 0;
	/// For Hero
	this.lastMoveTick = this.tick;
	if ( this.actionPointer < actions.len ){
	  var act = actions.actions[this.actionPointer];
	  if ( act.code >= 10 ){
	    this.boxes.clear();
	    attack = new Attack( hero );
	    attack.doStyle( atkStyles[act.code - 10] );
	    hero.coolDown[act.code-10] = atkStyles[act.code-10].cooldown;
	  }else if ( this.arrows.length > 0 ){
	    hero.move( this.arrows.dequeue().orientation );
	  }
	  this.actionPointer++;
	}else{
	  doneCount++;
	}
	
	/// For Enemy
	if ( this.AIPointer < actionsAI.len ){
	  var act = actionsAI.actions[this.AIPointer];
	  if ( act.code >= 10 ){
	    enemy.setOrientation( act.param );
	    attack = new Attack( enemy );
	    attack.doStyle( atkStyles[act.code-10] );
	    enemy.coolDown[act.code-10] = atkStyles[act.code-10].cooldown;
	  }else if ( 0 <= act.code && 4 > act.code ){
	    enemy.move( act.code );
	  }
	  this.AIPointer ++;
	}else{
	  doneCount++;
	}
	if ( 2 == doneCount ){
	  this.dispatchEvent( {name:"To Decision Mode"} );
	}
      }

      /**
       *  Decision Mode
       */
    } else {
      if ( keyboard.space && ( this.tick - this.lastKeyTick > this.keyInterval )){
	logic.dispatchEvent( { name: "To Action Mode" } );
      }
      if ((Date.now() - this.turnStart)/1000 > this.timePerTurn) {
	logic.dispatchEvent( { name: "To Action Mode" } );
      }
    }
  };

  this.draw = function() {
    var y = 30;
    ctx.font = "18pt sans-serif";
    ctx.fillStyle = "black";

    ctx.fillText("Level: " + this.level, 250, y);    
    y += 30;

    ctx.fillText("Turn: " + this.turn, 250, y);    
    y += 30;


    var time = Math.floor(this.timePerTurn - (Date.now() - this.turnStart)/1000);
    ctx.fillText("Time Remaining: " + time, 250, y);    
    y += 30;

    ctx.fillText("Player KP: " + this.playerKP, 250, y);    
    y += 30;

    ctx.fillText("AI KP: " + this.AIKP, 250, y);    
    y += 30;


    var phase =  (this.stage == 1) ? "Action Phase" : "Decision Phase";
    y += 30;
    ctx.font = "bold 20pt sans-serif";
    ctx.fillText(phase, 250, y);    
    y += 30;
  };
}
GameLogic.prototype = new GameObject;
