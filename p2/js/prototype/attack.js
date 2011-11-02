function Attack( caster ){
    /// Model:
    this.caster = caster;
    this.damage = 0;
    this.targets = new Array();
    this.cooldown = 0;
    this.style = null;
    /// View:
    this.tick = 0;
    this.parNum = 0;
    this.spd = 0;


    this.doDamage = function(){
	for ( var i=0; i<this.targets.length; i++ ){
	    if ( board.inBoard( this.targets[i].posX, this.targets[i].posY ) ){


	    }
	}
    };
    this.drawEffect2d = function() {
	for ( var i=0; i<this.targets.length; i++ ){
	    ctx.beginPath();
	    var c = board.getCenterCoordinates( this.targets[i].posX, this.targets[i].posY );
	    ctx.strokeStyle = "#FFA000";
	    ctx.lineWidth = 2;
	    ctx.arc( c.x, c.y, this.targets[i].circleRadius, 0, Math.PI * 2 );
	    ctx.closePath();
	    ctx.stroke();
	}
    }
    this.initEffects = function( i, parNum, spd ){
	/// 3D Particle Emitter Part
	this.targets[i].emit = new ParticleEmitter( this.targets[i].posX,
						    this.targets[i].posY,
						    parNum, this.targets[i].lifetime, spd );
	/// 2D Circle Part
	this.targets[i].circleRadius = 0;
    }

    this.update = function(){
	this.tick++;
	
	var doneNum = 0;
	for ( var i=0; i<this.targets.length; i++ ){
	    if ( Math.abs(this.tick - this.targets[i].start) < 0.1 ) {
		var obj = board.map[this.targets[i].posY][this.targets[i].posX];
		if ( obj.isPiece ){
		    obj.underAttack( this.damage, this.caster );
		}
		this.initEffects( i, this.parNum, this.spd );
	    } else if ( this.tick > this.targets[i].start ) {
		if ( this.tick <= this.targets[i].start + this.targets[i].lifetime ) {
		    this.targets[i].circleRadius += 0.08 * board.cellSize;
		}else{
		    this.targets[i].circleRadius = 0;
		    doneNum++;
		}
	    }
	}
	

	if ( doneNum >= this.targets.length ) {
	    this.shutdown();
	}
    };

    this.draw = function() {
//	this.drawEffect2d();
    }

    this.doStyle = function( style ) {

	this.parNum = style.parNum;
	this.damage = style.damage;
	this.spd = style.spd;
	    
	this.targets.length = 0;
	style.generate( this.caster );
	for ( var i=0; i<style.targets.length; i++ ){
	    this.targets.push( { posX: style.targets[i].posX,
				 posY: style.targets[i].posY,
				 start: style.targets[i].start,
				 lifetime: style.targets[i].lifetime,
				 circleRadius: 0 } );
	}
	this.init();

    }
}
Attack.prototype = new GameObject;


function AttackStyle() {
    /// Model:
    this.name = "";
    this.targets = new Array();
    this.damage = 0;
    this.cooldown = 1;

    /// View: 
    this.parNum = 100;
    this.spd = 0.4;
    this.generate = function( caster ){
	return;
    }
}

function MeleeAttack() {
    this.name = "Melee";
    this.parNum = 120;
    this.spd = 0.4;
    this.damage = 1;
    this.cooldown = 1;
    this.generate = function( caster ) {
	this.targets.length = 0;
	var posX = 0;
	var posY = 0;
	var k = 0;
	for ( var ort=0; ort<4; ort ++ ){
	    posX = caster.posX + board.dx[ort];
	    posY = caster.posY + board.dy[ort];
	    if ( board.inBoard( posX, posY ) ){
		k += 2;
		this.targets.push( { posX: posX, posY: posY, start: k, lifetime: 10 } );
	    }
	}
    }
}
MeleeAttack.prototype = new AttackStyle;


function PowerAttack() {
    this.name = "Power";
    this.parNum = 50;
    this.spd = 0.4;
    this.damage = 2;
    this.cooldown = 2;
    this.dx = [-1, 0, 1, 1, 1, 0, -1, -1];
    this.dy = [-1, -1, -1, 0, 1, 1, 1, 0];
    this.generate = function( caster ) {
	this.targets.length = 0;
	var posX = 0;
	var posY = 0;
	var k = 0;
	for ( var ort=0; ort<8; ort ++ ){
	    posX = caster.posX + this.dx[ort];
	    posY = caster.posY + this.dy[ort];
	    if ( board.inBoard( posX, posY ) ){
		k += 2;
		this.targets.push( { posX: posX, posY: posY, start: k, lifetime: 10 } );
	    }
	}
    }
}
PowerAttack.prototype = new AttackStyle;

function CrossAttack() {
    this.name = "Cross";
    this.parNum = 20;
    this.spd = 0.4;
    this.damage = 1;
    this.cooldown = 3;
    this.generate = function( caster ) {
	this.targets.length = 0;
	var posX = 0;
	var posY = 0;
	var k = 0;
	for ( var ort=0; ort<8; ort ++ ){
	    k = 0;
	    posX = caster.posX + board.dx[ort];
	    posY = caster.posY + board.dy[ort];
	    while ( board.inBoard( posX, posY ) ) {
		k += 2;
		this.targets.push( { posX: posX, posY: posY, start: k, lifetime: 10 } );
		posX += board.dx[ort];
		posY += board.dy[ort];
	    }
	}
    }
}
CrossAttack.prototype = new AttackStyle;


atkStyles = new Array();
atkStyles.push( new MeleeAttack );
atkStyles.push( new PowerAttack );
atkStyles.push( new CrossAttack );





