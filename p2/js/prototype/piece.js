function Piece(){
    /// The abstract Piece won't get initialized
    /// until instantiated with inheritance calss.
    
    this.isPiece = true; /// indicate an instance of Piece

    /// Health Points
    this.maxHP = 1;
    this.curHP = 1;

    /// Attack Cool Down
    this.coolDown = new Array(10);
    for ( var i=0; i<10; i++ ){
	this.coolDown[i] = 0;
    }
    
    /// Positions on Board
    this.posX = 0;
    this.posY = 0;

    
    /// Orientation: 
    /// 0=North, 1=West, 2=East, 3=South
    this.orientation = 0;

    /// Color
    this.color = "#FFFFFF";
    
    /// Shader
    this.shader = null;
    
    
    this.setMaxHP = function( maxHP ){
	this.maxHP = maxHP;
	this.curHP = maxHP;
    };


    this.leave = function(){
      board.map[this.posY][this.posX] = 0;
    };

    this.setPos = function( posX, posY ){
	if ( 0 == board.map[posY][posX] ){
	    this.posX = posX;
	    this.posY = posY;
	    board.map[posY][posX] = this;
	    return true;
	}else{
	    return false;
	}
    };

    this.move = function( ort ){
	var posX = this.posX + board.dx[ort];
	var posY = this.posY + board.dy[ort];
	if ( board.inBoard( posX, posY ) &&
	     ( 0 == board.map[posY][posX]) ){
	    this.setOrientation( ort );
	    this.leave();
	    this.setPos( posX, posY );
	    return true;
	}
	return false;
    };

    this.setOrientation= function( ort ){
	this.orientation = ort;
    };

    this.drawHPBar = function(){
	cellSize = board.cellSize;
	var c = board.getCoordinates( this.posX, this.posY );
	ctx.strokeStyle = "#00FF00";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo( c.x + 0.05 * cellSize, c.y + 0.9 * cellSize );
	ctx.lineTo( c.x + 0.05 * cellSize + 0.9 * this.curHP / this.maxHP * cellSize
		    , c.y + 0.9 * cellSize );
	ctx.closePath();
	ctx.stroke();
    };


    this.updateCoolDown = function() {
	for ( var i=0; i<10; i++ ){
	    if ( this.coolDown[i] > 0 ) {
		this.coolDown[i] -- ;
	    }
	}
    };

    this.setOrientation( 0 );
}
Piece.prototype = new GameObject;
