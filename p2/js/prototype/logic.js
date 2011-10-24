function GameLogic(){
    /// 0 = Decision Mode
    /// 1 = Movement Mode
    this.stage = 0;

    // Decision Stage:
    // For prototype
    // 0 = movements
    // 1 = attack
    this.init();

    this.arrowNum = 0;
    this.arrows = new Array( board.width * board.height );
    this.arrowPointer = 0;
    for ( var i=0; i< board.width * board.height; i++ ){
	this.arrows[i] = { posX:0, posY:0, orientation: 0, visible:false };
    }

    this.boxes = new Array( board.width * board.height );
    this.boxNum = 0;
    for ( var i=0; i< board.width * board.height; i++ ){
	this.boxes[i] = { posX:0, posY:0, visible:false };
    }

    this.curPosX = hero.posX;
    this.curPosY = hero.posY;
    this.tick = 0;
    this.lastKeyTick = 0;
    this.lastMoveTick = 0;
    this.moveInterval = 20;
    this.keyInterval = 10;



    /// Temp:
    this.attackOrientation = 0;

    this.drawArrow = function( arrow ){
	var cellSize = board.cellSize;
	c = board.getCenterCoordinates( arrow.posX, arrow.posY );
	
	ctx.strokeStyle = "#00EE00";
	ctx.lineWidth = 3;
	ctx.beginPath();
	
	var u = {x:0,y:0};
	var v0 = {x:0,y:0};
	var v1 = {x:0,y:0};
	u.y = -cellSize * 0.45;
	u.x = 0;
	v0 = board.align( u, arrow.orientation );
	v0.x += c.x;
	v0.y += c.y;
	
	
	u.x = - cellSize * 0.3;
	u.y = 0;
	v1 = board.align( u, arrow.orientation );
	v1.x += c.x;
	v1.y += c.y;
	ctx.moveTo( v0.x, v0.y );
	ctx.lineTo( v1.x, v1.y );

	u.x = cellSize * 0.3;
	u.y = 0;
	v1 = board.align( u, arrow.orientation );
	v1.x += c.x;
	v1.y += c.y;
	ctx.moveTo( v0.x, v0.y );
	ctx.lineTo( v1.x, v1.y );


	u.y = cellSize * 0.45;
	u.x = 0;
	v1 = board.align( u, arrow.orientation );
	v1.x += c.x;
	v1.y += c.y;
	ctx.moveTo( v0.x, v0.y );
	ctx.lineTo( v1.x, v1.y );

	ctx.closePath();
	ctx.stroke();
    }
    this.drawBox = function( box ){
	var cellSize = board.cellSize;
	c = board.getCenterCoordinates( box.posX, box.posY );
	
	ctx.strokeStyle = "#AA0000";
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	var v0 = {x:0,y:0};
	var v1 = {x:0,y:0};
	var v2 = {x:0,y:0};
	var v3 = {x:0,y:0};

    
	v0.x = - cellSize * 0.48 + c.x;
	v0.y = - cellSize * 0.48 + c.y;
	v1.x = cellSize * 0.48 + c.x;
	v1.y = - cellSize * 0.48 + c.y;
	v2.x = cellSize * 0.48 + c.x;
	v2.y = cellSize * 0.48 + c.y;
	v3.x = - cellSize * 0.48 + c.x;
	v3.y = cellSize * 0.48 + c.y;

	ctx.moveTo( v0.x, v0.y );
	ctx.lineTo( v1.x, v1.y );
	ctx.lineTo( v2.x, v2.y );
	ctx.lineTo( v3.x, v3.y );
	ctx.lineTo( v0.x, v0.y );
	ctx.moveTo( v0.x, v0.y );
	ctx.lineTo( v2.x, v2.y );
	ctx.moveTo( v1.x, v1.y );
	ctx.lineTo( v3.x, v3.y );

	ctx.closePath();
	ctx.stroke();
    }
    this.addArrow = function( posX, posY, ort ){
	this.arrows[this.arrowNum].posX = posX;
	this.arrows[this.arrowNum].posY = posY;
	this.arrows[this.arrowNum].orientation = ort;
	this.arrows[this.arrowNum].visible = true;
	this.arrowNum ++;
    }
    this.addBox = function( posX, posY ){
	this.boxes[this.boxNum].posX = posX;
	this.boxes[this.boxNum].posY = posY;
	this.boxes[this.boxNum].visible = true;
	this.boxNum ++;
    }
    this.clearBoxes = function(){
	this.boxNum = 0;
    }
    this.draw = function(){
	for ( var i=0; i<this.arrowNum; i++ ){
	    if ( this.arrows[i].visible ){
		this.drawArrow( this.arrows[i] );
	    }
	}
	for ( var i=0; i<this.boxNum; i++ ){
	    if ( this.boxes[i].visible ){
		this.drawBox( this.boxes[i] );
	    }
	}
    }
    this.update = function(){
	this.tick ++;


	/// Action Mode
	if ( this.stage == 1 ){
	    if ( this.tick - this.lastMoveTick > this.moveInterval ) {
		this.lastMoveTick = this.tick;
		if ( this.arrowPointer < this.arrowNum ){
		    hero.move( this.arrows[this.arrowPointer].orientation );
		    this.arrows[this.arrowPointer].visible = false;
		    this.arrowPointer++;
		}else if ( this.boxNum > 0 ){
		    this.clearBoxes();
		    hero.setOrientation( this.attackOrientation );
		    attack = new MeleeAttack( hero );
		}else{
		    this.arrowNum = 0;
		    this.stage = 0;
		    actions.reset();
		    streams.reset();
		}
	    }
	    return;
	}
	

	/// Decision Mode
	if ( actions.len > 0 ){
	    var posX = hero.posX;
	    var posY = hero.posY;
	    var posX0 = 0;
	    var posY0 = 0;
	    this.arrowNum = 0;
	    for ( var i=0; i<actions.len-1; i++ ){
		posX0 = posX + board.dx[actions.actions[i].code];
		posY0 = posY + board.dy[actions.actions[i].code];
		if ( board.inBoard( posX0, posY0 ) &&
		     0 == board.map[posY0][posX0] ){
		    posX = posX0;
		    posY = posY0;
		    this.addArrow( posX, posY, actions.actions[i].code );
		}
	    }
	    this.clearBoxes();
	    this.attackOrientation = actions.actions[actions.len-1].param;
	    this.addBox( posX + board.dx[actions.actions[actions.len-1].param],
			 posY + board.dy[actions.actions[actions.len-1].param] );
	}

	if ( keyboard.space && ( this.tick - this.lastKeyTick > this.keyInterval )){
	    /// To movements stage
	    this.stage = 1;
	    this.lastKeyTick = this.tick;
	    this.lastMoveTick = this.tick;
	    this.arrowPointer = 0;
	}
    
    }
	
}
GameLogic.prototype = new GameObject;
