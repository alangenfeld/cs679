function Piece(){
    /// The abstract Piece won't get initialized
    /// until instantiated with inheritance calss.
    this.isPiece = true;
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

    this.setOrientation( 0 );
}
Piece.prototype = new GameObject;



function Character( maxHP, color, posX, posY, ort ){
    this.type = 1;
    this.setMaxHP(maxHP);
    this.setPos( posX, posY );
    this.color = color;
    this.colorV = [0.0, 0.0, 1.0];
    this.setOrientation( ort );

    this.shader = getShader("hero");
    setAttribute(this, 
		 {name: "vtx",
		  content: [
		    1.0, 1.0, 0.0,
		    0.0, 0.0, 2.0,
		      -1.0, 1.0, 0.0,
		    
		      -1.0, 1.0, 0.0,
		    0.0, 0.0, 2.0,
		      -1.0, -1.0, 0.0,
		    
		      -1.0, -1.0, 0.0,
		    0.0, 0.0, 2.0,
		    1.0, -1.0, 0.0,
		    
		    1.0, -1.0, 0.0,
		    0.0, 0.0, 2.0,
		    1.0, 1.0, 0.0
		  ]});

    setAttribute(this, 
		 {name: "normal",
		  content: [
		    0.0, 1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, 1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, 1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),

		    -1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    -1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    -1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),

		    0.0, -1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, -1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, -1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),

		    1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0)
		  ]});

    setUpLights(this.shader);
    this.shader.color = gl.getUniformLocation(this.shader, "color");
    this.attributes = ["vtx", "normal"];
    this.attributes.size = 12;

    this.init();

    this.draw = function(){
      this.draw2d();
      this.draw3d();
    };

    this.draw2d = function(){
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
    };
  
    this.draw3d = function() {
      mvPushMatrix();

      mat4.translate(mvMatrix, [this.posX/2.0, this.posY/2.0, 0.0]);
      mat4.scale(mvMatrix, [0.25, 0.25, 0.25]);
      mat4.translate(mvMatrix, [1.0, 1.0, 0.0]);

      gl.useProgram(this.shader);
      
      gl.uniform3fv(this.shader.color, this.colorV);
      bindLights(this.shader);
      bindAttributes(this);
      
      setMatrixUniforms(this.shader);
      
      gl.drawArrays(gl.TRIANGLES, 0, this.attributes.size);
      mvPopMatrix();
    };
}
Character.prototype = new Piece;

function Pawn( maxHP, color, posX, posY ){
    this.type = 3;
    this.color = color;
    this.colorV = [1.0, 0.0, 0.0];
    this.setPos( posX, posY );
    this.setMaxHP( maxHP );
    this.sparkCount = 0;
    this.visible = true;

    this.shader = getShader("pawn");
    setAttribute(this, 
		 {name: "vtx",
		  content: [
		    1.0, 1.0, 0.0,
		    0.0, 0.0, 2.0,
		      -1.0, 1.0, 0.0,
		    
		      -1.0, 1.0, 0.0,
		    0.0, 0.0, 2.0,
		      -1.0, -1.0, 0.0,
		    
		      -1.0, -1.0, 0.0,
		    0.0, 0.0, 2.0,
		    1.0, -1.0, 0.0,
		    
		    1.0, -1.0, 0.0,
		    0.0, 0.0, 2.0,
		    1.0, 1.0, 0.0
		  ]});


    setAttribute(this, 
		 {name: "normal",
		  content: [
		    0.0, 1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, 1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, 1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),

		    -1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    -1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    -1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),

		    0.0, -1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, -1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),
		    0.0, -1.0/Math.sqrt(2.0), 1.0/Math.sqrt(2.0),

		    1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0),
		    1.0/Math.sqrt(2.0), 0.0, 1.0/Math.sqrt(2.0)
		  ]});

    setUpLights(this.shader);
    this.shader.color = gl.getUniformLocation(this.shader, "color");
    this.shader.hp = gl.getUniformLocation(this.shader, "hp");

    this.attributes = ["vtx", "normal"];
    this.attributes.size = 12;

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
	if ( this.curHP <= 0 ){
	    this.shutdown();
	}
    };

    this.draw = function(){
      this.draw2d();
      this.draw3d();
    };

    this.draw2d = function(){
	if ( this.visible ){
	    var c = board.getCenterCoordinates( this.posX, this.posY );
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc( c.x, c.y, 0.25 * board.cellSize, 0, Math.PI * 2 );
	    ctx.closePath();
	    ctx.fill();
	}
	this.drawHPBar();
    };

    this.draw3d = function() {
      mvPushMatrix();

      mat4.translate(mvMatrix, [this.posX/2.0, this.posY/2.0, 0.0]);
      mat4.scale(mvMatrix, [0.25, 0.25, 0.25]);
      mat4.translate(mvMatrix, [1.0, 1.0, 0.0]);

      gl.useProgram(this.shader);
      
      gl.uniform3fv(this.shader.color, this.colorV);
      gl.uniform1f(this.shader.hp, this.curHP/this.maxHP);
      bindLights(this.shader);
      bindAttributes(this);
      
      setMatrixUniforms(this.shader);
      
      gl.drawArrays(gl.TRIANGLES, 0, this.attributes.size);
      mvPopMatrix();
    };
}
Pawn.prototype = new Piece;
