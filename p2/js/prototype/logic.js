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
  this.turnStart = 0;
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
  this.moveInterval = 10;
  this.keyInterval = 10;

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
  
  this.clear = function(){
    actions.reset();
    actionsAI.reset();
    streams.reset();
    this.arrows.clear();
    this.boxes.clear();
  };

  this.eventStack = new Array();

  this.dispatchEvent = function(e){
    this.eventStack.push(e);
  };

  this.update = function(){
    this.tick ++;

    // Event Process
    while ( this.eventStack.length > 0 ){
      var e = this.eventStack.pop();
      if ( "Player Kill" == e.name ){
	this.playerKP++;
      } else if ( "AI Kill" == e.name ){
	this.AIKP++;
      } else if ( "Clear" == e.name ){
	this.clear();
      } else if ( "To Decision Mode" == e.name ){
	this.stage = 0;
	this.turn ++; 
	this.turnStart = this.tick;
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
	if ( enemy.curHP > 0 ){
	  enemy.think();
	}
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
	if ( enemy.curHP <= 0 ){
	  doneCount++;
	} else if ( this.AIPointer < actionsAI.len ){
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
      if ((this.playerKP > this.AIKP + pawns.length) ||
	  (pawns.length < 1 && this.playerKP == this.AIKP) ||
	  (enemy.death && this.playerKP + pawns.length >= this.enemyKP)) {
	showVictory();
	var nextLevel = this.level + 1;
	game.over(
	  function(){
	    returnToGame();
	    startLevel(nextLevel);
	  });
      } else if ((this.AIKP > this.playerKP + pawns.length) ||
		 (hero.death && this.AIKP + pawns.length >= this.playerKP)) {
	showGameOver();
	game.over(
	  function(){
	    returnToGame();
	    startLevel(1);
	  });
      }

      this.timeRemaining = this.timePerTurn - ((this.tick - this.turnStart)/60);
      if (this.timeRemaining <= 0) {
	logic.dispatchEvent( { name: "To Action Mode" } );
      }
    }
  };

  this.draw = function() {
    var y = 30;
    var x = 10;
    ctx.font = "20pt sans-serif";
    ctx.fillStyle = "black";

    ctx.fillText("Level: " + this.level, x, y);    
    y += 30;

    ctx.fillText("Turn: " + this.turn, x, y);    
    y += 30;

    ctx.fillText("Pawns Remaining: " + pawns.length, x, y);    
    y += 30;

    ctx.fillText("Player Kills: " + this.playerKP, x, y);    
    y += 30;

    ctx.fillText("AI Kills: " + this.AIKP, x, y);    
    y += 30;

    ctx.font ="bold 20pt sans-serif";
    ctx.fillStyle = (this.timeRemaining > 5) ? "black" : "red";
    var time = (this.timeRemaining > 10) ? Math.ceil(this.timeRemaining) : 
      this.timeRemaining;
    ctx.fillText("Time Remaining: " + time, 200, 30);    
    ctx.fillStyle = "black";
    y += 30;


    var phase =  (this.stage == 1) ? "Action Phase" : "Decision Phase";
    y += 30;
    ctx.font = "bold 24pt sans-serif";
    ctx.fillText(phase, x, y);    
    y += 30;
  };
}
GameLogic.prototype = new GameObject;
