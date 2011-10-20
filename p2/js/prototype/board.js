function GameBoard( width, height, cellSize ){
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.orientation = 0;
  
    this.shader = getShader("gameBoard");
    setAttribute(this, 
		 {name: "vtx",
		  content: [
		    width/4.0,  height/4.0,  0.0,
		    -width/4.0,  height/4.0,  0.0,
		    width/4.0,  -height/4.0,  0.0,
		    -width/4.0,  -height/4.0,  0.0
		  ]});
    setAttribute(this, 
		 {name: "normal",
		  content: [
		    0.0,  0.0,  1.0,
		    0.0,  0.0,  1.0,
		    0.0,  0.0,  1.0,
		    0.0,  0.0,  1.0
		  ]});

    setUpLights(this.shader);
    this.attributes = ["vtx", "normal"];
    this.attributes.num = 4;

    this.init();

    /// Map:
    /// 0 = Empty
    /// 1 = hero
    /// 2 = enemy
    /// 3 = pawn
    this.map = new Array(this.height);
    for ( var i=0; i<this.height; i++ ){
	this.map[i] = new Array(this.width);
	for ( var j=0; j<this.width; j++ ){
	    this.map[i][j] = 0;
	}
    }

    this.dx = [ 0, -1, 1, 0 ];
    this.dy = [ -1, 0, 0, 1 ];


    this.getCoordinates = function( posX, posY ){
	var coor = {x:posX * this.cellSize, y:posY * this.cellSize};
	return coor;
    };

    this.getCenterCoordinates = function( posX, posY ){
	var coor = { x:( posX + 0.5 ) * this.cellSize , y:( posY + 0.5 ) * this.cellSize };
	return coor;
    };

    this.inBoard = function( posX, posY ){
	return (posX >= 0 && posX < this.width && posY >= 0 && posY < this.height);
    };
    
    this.align = function( u, ort ){
	v = { x:0, y:0 };
	if ( ort == 0 ){
	    v.x = u.x;
	    v.y = u.y;
	}else if ( ort == 1 ){
	    v.x = u.y;
	    v.y = -u.x;
	}else if ( ort == 2 ){
	    v.x = -u.y;
	    v.y = u.x;
	}else{
	    v.x = -u.x;
	    v.y = -u.y;
	}
	return v;
    };

    this.draw = function(){
      this.draw2d();
      this.draw3d();
    };

    this.draw2d = function(){
	var i = 0;
	var j = 0;
	var x = 0;
	var y = this.y;
	for ( i = 0; i < height; i ++ ){
	    x = this.x;
	    for ( j = 0; j < width; j ++ ){
		if ( ( i + j ) & 1 ){
		    ctx.fillStyle = "#000000";
		}else{
		    ctx.fillStyle = "#FFFFFF";
		}
		ctx.beginPath();
		ctx.moveTo( x, y );
		ctx.lineTo( x + this.cellSize, y );
		ctx.lineTo( x + this.cellSize, y + this.cellSize );
		ctx.lineTo( x, y + this.cellSize );
		ctx.lineTo( x, y );
		ctx.closePath();
		ctx.fill();
		x = x + this.cellSize;
	    }
	    y = y + this.cellSize;
	}
	return;
    };


    this.draw3d = function() {
      mvPushMatrix();

      gl.useProgram(this.shader);
      
      bindLights(this.shader);
      bindAttributes(this);

      mat4.translate(mvMatrix, [this.width/4.0, this.height/4.0, 0.0]);
      setMatrixUniforms(this.shader);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.attributes.num);

      mvPopMatrix();
    };
}
GameBoard.prototype = new GameObject;
