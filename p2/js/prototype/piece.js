function Piece(){
    /// The abstract Piece won't get initialized
    /// until instantiated with inheritance calss.
    this.type = -1;
    this.maxHP = 1;
    this.curHP = 1;
    this.posX = 0;
    this.posY = 0;
    /// Orientation: 
    /// 0=North, 1=West, 2=East, 3=South
    this.orientation = 0;
    this.color = "#FFFFFF";
    this.setMaxHP = function( maxHP ){
	this.maxHP = maxHP;
	this.curHP = maxHP;
    }
    this.draw = function(){
	return;
    };
    this.setPos = function( posX, posY ){
	if ( board.map[posY][posX] == 0 ){
	    this.posX = posX;
	    this.posY = posY;
	    board.map[posY][posX] = this.type;
	    return true;
	}else{
	    return false;
	}
    }
    this.move = function( ort ){
	if ( board.inBoard( this.posX + board.dx[ort], this.posY + board.dy[ort] ) ){
	    this.posX += board.dx[ort];
	    this.posY += board.dy[ort];
	    return true;
	}
	return false;
    }
    this.setOrientation= function( ort ){
	this.orientation = ort;
    }
    this.drawHPBar = function(){
	cellSize = board.cellSize;
	var c = board.getCoordinates( this.posX, this.posY );
	ctx.strokeStyle = "#00FF00";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo( c.x + 0.05 * cellSize, c.y + 0.9 * cellSize );
	ctx.lineTo( c.x + 0.95 * cellSize, c.y + 0.9 * cellSize );
	ctx.closePath();
	ctx.stroke();
    }
    this.setOrientation( 0 );
}
Piece.prototype = new GameObject;



function Character( maxHP, color, posX, posY, ort ){
    this.type = 1;
    this.setMaxHP(maxHP);
    this.setPos( posX, posY );
    this.color = color;
    this.init();
    this.setOrientation( ort );
    this.draw = function(){
	var cellSize = board.cellSize;
	var c = board.getCenterCoordinates( this.posX, this.posY );


	var u = { x:0, y:0 };
	var v = { x:0, y:0 };


	ctx.fillStyle = this.color;
	ctx.beginPath();

	u.x = 0;
	u.y = - 0.4 * cellSize;
	v = board.align( u, this.orientation );
	v.x += c.x;
	v.y += c.y;
	ctx.moveTo( v.x, v.y );


	u.x = 0.25 * cellSize;
	u.y = 0.4 * cellSize;
	v = board.align( u, this.orientation );
	v.x += c.x;
	v.y += c.y;
	ctx.lineTo( v.x, v.y );

	u.x = - 0.25 * cellSize;
	u.y = 0.4 * cellSize;
	v = board.align( u, this.orientation );
	v.x += c.x;
	v.y += c.y;
	ctx.lineTo( v.x, v.y );

	u.x = 0;
	u.y = - 0.4 * cellSize;
	v = board.align( u, this.orientation );
	v.x += c.x;
	v.y += c.y;
	ctx.lineTo( v.x, v.y );
	
	ctx.closePath();
	ctx.fill();

	this.drawHPBar();
    }
    
}
Character.prototype = new Piece;
var hero = new Character( 12, "#0000FF", 1, 1, 3 );


function Pawn( maxHP, color, posX, posY ){
    this.type = 3;
    this.color = color;
    this.setPos( posX, posY );
    this.setMaxHP( maxHP );
    this.sparkCount = 0;
    this.visible = true;
    this.init();
    this.update = function(){
	if ( this.sparkCount > 0 ){
	    this.sparkCount--;
	    if ( this.sparkCount % 5 == 0 ){
		this.visible = !this.visible;
	    }
	    if ( this.sparkCount <= 0 ){
		this.visible = true;
	    }
	}
    }
    this.draw = function(){
	if ( this.visible ){
	    var c = board.getCenterCoordinates( this.posX, this.posY );
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc( c.x, c.y, 0.25 * board.cellSize, 0, Math.PI * 2 );
	    ctx.closePath();
	    ctx.fill();
	}
	this.drawHPBar();
    }
}
Pawn.prototype = new Piece;
var pawns = new Array(7);
for ( var i=0; i<7; i++ ){
    while ( true ){
	var px = Math.floor( Math.random() * board.width );
	var py = Math.floor( Math.random() * board.height );
	if ( px < board.width && py < board.height && board.map[py][px] == 0 ){
	    pawns[i] = new Pawn( 4, "#FF0000", px, py );
	    break;
	}
    }
}