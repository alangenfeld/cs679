function Pawn( maxHP, color, posX, posY ){
    this.type = 3;
    this.color = color;
    this.colorV = [1.0, 0.0, 0.0];
    this.setPos( posX, posY );
    this.setMaxHP( maxHP );
    this.sparkCount = 0;
    this.visible = true;
    this.onAnimation = 0;
    this.animations = new Array();
    this.death = false;

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
	
	if ( this.death && this.onAnimation == 0 ) {
	    this.leave();
	    this.shutdown();
	}
	this.updateAnimations();
    };

    this.draw = function(){
	if ( this.onAnimation > 0 ) {
	    this.drawAnimations();
	} else {
	    this.draw2d();
	    this.draw3d();
	}
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

    this.bindAnimations = function() {
	/// Spark: for underattack
	this.animations.push( new Animation( this, "spark", 20 ) );
	this.animations[0].draw = function() {
	    if ( this.tick % 4 < 2 ){
		this.obj.draw2d();
		this.obj.draw3d();
	    }
	};
	this.animations[0].init();
    }


    this.underAttack = function( damage, caster ) {
	this.curHP -= damage;
	this.animations[0].init();
	if ( this.curHP <= 0 ) {
	    eventString = caster.type == 1 ? "Player Kill" : "AI Kill";
	    logic.dispatchEvent( { name: eventString } );
	    this.death = true;
	}
    }

    this.bindAnimations();
}
Pawn.prototype = new Piece;
