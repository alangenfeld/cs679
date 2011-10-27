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
	  var killString = (this.hitBy == 1) ? "Player Kill" : "AI Kill";
	  logic.dispatchEvent({name:killString});
	  this.leave();
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
