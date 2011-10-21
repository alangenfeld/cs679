function Attack(){
    /// The abstract Attack won't get initialized
    /// until instantiated with inheritance calss.
    this.caster = null;
    this.posX = 0;
    this.posY = 0;
    this.damage = 0;
    this.lifetime = 0;
    this.targets = null;
    this.targetNum = 0;
    this.setCaster = function( caster ){
	this.caster = caster;
	this.posX = caster.posX;
	this.posY = caster.posY;
    }
    this.doDamage = function(){
	for ( var i=0; i<this.targetNum; i++ ){
	    var obj = board.map[this.targets[i].posY][this.targets[i].posX];
	    if ( obj.isPiece ){
		console.log( obj );
		obj.curHP -= this.damage;
	    }
	}
    }
}
Attack.prototype = new GameObject;


function MeleeAttack( caster ){
    this.damage = 1;
    this.setCaster( caster );
    this.circleSize = board.cellSize * 0.1;
    this.lifetime = 10;
    this.init();
    this.targetNum = 1;
    this.targets = new Array(this.targetNum);

    for ( var i=0; i<this.targetNum; i++ ){
	this.targets[i] = { posX: caster.posX + board.dx[caster.orientation], 
			    posY: caster.posY + board.dy[caster.orientation] };
    }

    this.update = function(){
	if ( this.lifetime > 0 ){
	    this.lifetime--;
	    this.circleSize += board.cellSize * 0.08;
	}else{
	    this.doDamage();
	    this.shutdown();
	}
    }
    this.draw2d = function(){
	var cellSize = board.cellSize;
	for ( var i=0; i<this.targetNum; i++ ){
	    var c = board.getCenterCoordinates( this.targets[i].posX, this.targets[i].posY );
	    ctx.strokeStyle = "#FFA000";
	    ctx.lineWidth = 2;
	    ctx.beginPath();
	    ctx.arc( c.x, c.y, this.circleSize, 0, Math.PI * 2 );
	    ctx.closePath();
	    ctx.stroke();
	}
    }
    this.draw = function(){
	this.draw2d();
    }
}
MeleeAttack.prototype = new Attack;
