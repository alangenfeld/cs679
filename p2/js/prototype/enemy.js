function Enemy( maxHP, color, posX, posY, ort ){
    this.type = 2;
    this.setMaxHP(maxHP);
    this.setPos( posX, posY );
    this.color = color;
    this.colorV = [1.0, 0.8, 0.0];
    this.setOrientation( ort );
    this.onAnimation = 0;
    this.animations = new Array();
    this.streams = null;
    
    this.shader = getShader( "enemy" );
    setAttribute( this, 
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
    setAttribute( this,
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

    setUpLights( this.shader );

    this.shader.color = gl.getUniformLocation( this.shader, "color" );
    this.attributes = ["vtx", "normal"];
    this.attributes.size = 12;

    this.init();

    this.draw = function(){
	if ( this.onAnimation > 0 ) {
	    this.drawAnimations();
	} else {
//	    this.draw2d();
	    this.draw3d();
	}
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
    }
    
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

    this.setStreams = function( s ){
	this.streams = new Array( s.length );
	for ( var i=0; i<this.streams.length; i ++ ){
	    this.streams[i] = s[i];
	}
    };
    
    this.think = function() {
	var decision = {p0:0, p1:0, atk:0, score:-3};
	var maxLen = actionsAI.maxLen - 1;
	var score = 0;
	for ( var p0=0; p0<this.streams.length; p0++ ){
	    var curPosX = this.posX;
	    var curPosY = this.posY;
	    for ( var p1=p0; p1<p0 + maxLen - 1; p1 ++ ){
		if ( p1 >= this.streams.length ){
		    break;
		}
		/// Try this step
		var newPosX = curPosX + board.dx[this.streams[p1]];
		var newPosY = curPosY + board.dy[this.streams[p1]];
		if ( board.inBoard( newPosX, newPosY ) && 
		     board.map[newPosY][newPosX] == 0 ){
		    curPosX = newPosX;
		    curPosY = newPosY;
		}
		
		for ( var i=0; i<atkStyles.length; i++ ) {
		    if ( this.coolDown[i] > 0 ) {
			continue;
		    }
		    score = -atkStyles[i].cooldown;
		    var caster = { posX: curPosX, posY: curPosY };
		    atkStyles[i].generate( caster );
		    for ( var j=0; j<atkStyles[i].targets.length; j++ ) {
			var obj = board.map[atkStyles[i].targets[j].posY][atkStyles[i].targets[j].posX];
			if ( obj.isPiece && obj != this ) {
			    if ( obj.curHP > 1 ) {
				score += 1;
			    }else{
				score += 10;
			    }
			}
		    }
		    if ( score > decision.score ){
			decision.p0 = p0;
			decision.p1 = p1;
			decision.atk = i;
			decision.score = score;
		    }
		}
	    }
	}


	
	
	/// Updates actionsAI
	actionsAI.pushStream(this.streams, decision.p0, decision.p1);      
	actionsAI.push( 10 + decision.atk, 0 );

	/// Remove selected movements from streams;
	this.streams.splice( decision.p0, decision.p1 - decision.p0 + 1 );
    };


    this.bindAnimations = function() {
	/// Shake: for underattack
	this.animations.push( new Animation( this, "shake", 20 ) );
	this.animations[0].draw = function() {
	    if ( this.tick % 4 < 2 ){
		this.obj.draw2d();
		this.obj.draw3d();
	    }
	};
    }
    
    this.update = function(){
	if ( this.death && this.onAnimation == 0 ) {
	    this.leave();
	    this.shutdown();
	}
	this.updateAnimations();
    };



    this.underAttack = function( damage, caster ) {
	if ( this.death ) {
	    return ;
	}
	this.curHP -= damage;
	this.animations[0].init();
	if ( this.curHP <= 0 ) {
	    logic.dispatchEvent( { name: "AI Dead" } );
	    this.death = true;
	}
    }
    this.bindAnimations();
}
Enemy.prototype = new Piece;
