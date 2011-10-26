function GameLogic(){
  /// 0 = Decision Mode
  /// 1 = Movement Mode
  this.stage = 0;

  // Decision Stage:
  // For prototype
  // 0 = movements
  // 1 = attack

  this.level = 0;
  this.turn = 0;
  this.timePerTurn = 100;
  this.turnStart = Date.now();

  this.init();

  this.arrows = new Array();
  this.arrowPointer = 0;

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

  this.clearBoxes = function() {
    for (var i in this.boxes) {
      this.boxes[i].shutdown();
      this.boxes.splice(i, 1);
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
	if ( this.arrowPointer < this.arrows.length){
	  hero.move(this.arrows[this.arrowPointer].orientation );
	  this.arrows[this.arrowPointer].shutdown();
	  this.arrowPointer++;
	}else if (this.boxes.length > 0 ){
	  this.clearBoxes();
	  hero.setOrientation( this.attackOrientation );
	  attack = new MeleeAttack( hero );
	}else{
	  this.arrows = new Array();
	  this.stage = 0;
	  this.turn++;
	  this.turnStart = Date.now();
	  actions.reset();
	  streams.reset();
	}
      }
      return;
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
      }
      if ((Date.now() - this.turnStart)/1000 > this.timePerTurn) {
	this.arrowPointer = 0;
	this.lastKeyTick = this.tick;
	this.lastMoveTick = this.tick;
	this.stage = 1;
      }
    }
  };
}
GameLogic.prototype = new GameObject;
