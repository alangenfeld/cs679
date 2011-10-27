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
