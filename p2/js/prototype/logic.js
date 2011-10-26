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
  this.attackOrientation = 0;

  this.boxes.clear = this.arrows.clear = function() {
    for (var i=0; i<this.length; i++) {
      this[i].shutdown();
      this.splice(i, 1);
    }
  };

  this.arrows.dequeue = function() {
    this[0].shutdown();
    this.splice(0, 1);
  };

  this.update = function(){
    this.tick ++;

    /**
     *  Action Mode
     */
    if ( this.stage == 1 ){
      if ( this.tick - this.lastMoveTick > this.moveInterval ) {
	this.lastMoveTick = this.tick;
	if (this.actionPointer < actions.len) {
	  if (actions.actions[this.actionPointer].code == 10) {
	    this.boxes.clear();
	    hero.setOrientation( this.attackOrientation );
	    /**
	     * THIS NEEDS TO CHANGE
	     */
	    attack = new MeleeAttack( hero );
	  } else {
	    this.arrows.dequeue();
	    hero.move(actions.actions[this.actionPointer].code);
	  }
	  this.actionPointer++;
	} else {
	  this.stage = 0;
	  this.turn++;
	  this.turnStart = Date.now();
	  actions.reset();
	  streams.reset();
	}
      }
      return;
    }  
    /**
     *  Decision Mode
     */ 
    else {
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
	  if (actions.actions[i].code == 10) {
	    this.attackOrientation = actions.actions[i].param;
	    this.boxes.push(
	      new TargetBox(
		posX + board.dx[actions.actions[i].param],
		posY + board.dy[actions.actions[i].param]
	      ));
	  }
	  else if(board.inBoard( posX0, posY0 ) &&
		  0 == board.map[posY0][posX0] ) {
		    posX = posX0;
		    posY = posY0;
		    this.arrows.push(new Arrow(posX, posY, actions.actions[i].code));
		  }
	}
	this.futureX = posX;
	this.futureY = posY;
      }
      
      if ( keyboard.space && ( this.tick - this.lastKeyTick > this.keyInterval )){
	this.stage = 1;
	this.lastKeyTick = this.tick;
	this.lastMoveTick = this.tick;
	this.actionPointer = 0;
      }
      if ((Date.now() - this.turnStart)/1000 > this.timePerTurn) {
	this.actionPointer = 0;
	this.lastKeyTick = this.tick;
	this.lastMoveTick = this.tick;
	this.stage = 1;
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


    var phase =  (this.stage == 1) ? "Action Phase" : "Decesion Phase";
    y += 30;
    ctx.font = "bold 20pt sans-serif";
    ctx.fillText(phase, 250, y);    
    y += 30;
  };
}
GameLogic.prototype = new GameObject;
