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

<<<<<<< HEAD
    this.arrows = new Array();
    this.arrowPointer = 0;
    this.AIPointer = 0;
=======
  this.arrows = new Array();
  this.actionPointer = 0;
>>>>>>> 1153a51326405b5050df124f461a41e7ec2c05cb

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

<<<<<<< HEAD
    this.clearBoxes = function() {
	for (var i in this.boxes) {
	    this.boxes[i].shutdown();
	    this.boxes.splice(i, 1);
	}
    };

    this.eventStack = new Array(0);


    this.dispatchEvent = function( e ){
	this.eventStack.push(e);
    }

    this.update = function(){
	this.tick ++;


	// Event Process
	while ( this.eventStack.length > 0 ){
	    e = this.eventStack.pop();
	    if ( "To Decision Mode" == e.name ){
		this.arrows = new Array();
		this.stage = 0;
		this.turn ++; 
		this.turnStart = Date.now();
		actions.reset();
		actionsAI.reset();
		streams.reset();
	    }
	}

	/**
	 *  Action Mode
	 */
	if ( this.stage == 1 ){
	    if ( this.tick - this.lastMoveTick > this.moveInterval ) {
		var moveCount = 1;
		/// For Hero
		this.lastMoveTick = this.tick;
		if ( this.arrowPointer < this.arrows.length){
		    hero.move(this.arrows[this.arrowPointer].orientation );
		    this.arrows[this.arrowPointer].shutdown();
		    this.arrowPointer++;
		}else if (this.boxes.length > 0 ){
		    this.clearBoxes();
		    hero.setOrientation( this.attackOrientation );
		    attack = new MeleeAttack( hero );
		}else{
		    moveCount = 0;
		}

		/// For Enemy
		if ( this.AIPointer < actionsAI.len ){
		    moveCount++;
		    act = actionsAI.actions[this.AIPointer];
		    if ( act.code == 10 ){
			enemy.setOrientation( act.param );
			attack = new MeleeAttack( enemy );
		    }else if ( 0 <= act.code && 4 > act.code ){
			enemy.move( act.code );
		    }
		    this.AIPointer ++;
		}
		if ( 0 == moveCount ){
		    this.dispatchEvent( {name:"To Decision Mode"} );
		}
	    }
	    /**
	     *  Decision Mode
	     */
	} else {
	    if (actions.len > 0 && this.arrows.length < 1){
		var posX = hero.posX;
		var posY = hero.posY;
		var posX0 = 0;
		var posY0 = 0;
		for ( var i=0; i<actions.len-1; i++ ){
		    posX0 = posX + board.dx[actions.actions[i].code];
		    posY0 = posY + board.dy[actions.actions[i].code];
		    if ( board.inBoard( posX0, posY0 ) &&
			 0 == board.map[posY0][posX0] ){
			posX = posX0;
			posY = posY0;
			this.arrows.push(new Arrow(posX, posY, actions.actions[i].code));
		    }
		}
		this.futureX = posX;
		this.futureY = posY;
	    }
	    if (actions.len > 0){
		this.clearBoxes();
		this.attackOrientation = actions.actions[actions.len-1].param;
		this.boxes.push(new TargetBox(
		    this.futureX + board.dx[actions.actions[actions.len-1].param],
		    this.futureY + board.dy[actions.actions[actions.len-1].param]));
		
	    }
	    if ( keyboard.space && ( this.tick - this.lastKeyTick > this.keyInterval )){
		this.stage = 1;
		this.lastKeyTick = this.tick;
		this.lastMoveTick = this.tick;
		this.arrowPointer = 0;
		this.AIPointer = 0;
		enemy.think();
	    }
	    if ((Date.now() - this.turnStart)/1000 > this.timePerTurn) {
		this.arrowPointer = 0;
		this.AIPointer = 0;
		this.lastKeyTick = this.tick;
		this.lastMoveTick = this.tick;
		this.stage = 1;
		enemy.think();
	    }
	}
    };
=======
  this.boxes.clear =  
  this.arrows.clear = function() {
    for (var i=0; i<this.length; i++) {
      this[i].shutdown();
    }
    this.splice(0, this.length);
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
	  } else if (this.arrows.length > 0) {
	    hero.move(this.arrows.dequeue().orientation);
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
	  else if(board.inBoard( posX0, posY0 ) && 0 == board.map[posY0][posX0] ) {
	    posX = posX0;
	    posY = posY0;
	    this.arrows.push(new Arrow(posX, posY, actions.actions[i].code));
	  }
	}
	this.futureX = posX;
	this.futureY = posY;
      }
      
      if ((Date.now() - this.turnStart)/1000 > this.timePerTurn) {
	this.actionPointer = 0;
	this.lastKeyTick = this.tick;
	this.lastMoveTick = this.tick;
	this.stage = 1;
      }
    }
  };
>>>>>>> 1153a51326405b5050df124f461a41e7ec2c05cb

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
