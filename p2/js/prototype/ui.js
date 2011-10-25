function MovementStream( x, y, cellSize, w, h ) {
    
    this.stream = new Array(500);
    for ( var i=0; i<500; i++ ){
	this.stream[i] = 0;
    }
    this.property = new Array(500);
    for ( var i=0; i<500; i++ ){
	this.property[i] = { enabled: true, marked: false };
    }
    this.len = 0;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.cellSize = cellSize;
    
    this.showFrom = 0;

    
    this.tick = 0;
    this.lastClickTick = 0;
    this.clickInterval = 20;
    this.status = { click: 0,
		    ready: true,
		    id0: 0,
		    id1: 0 };
		    

    

    
    this.init();
    
    /// Randomly generate movement streams
    this.generate = function( n ) {
	for ( var i=0; i<n ;i++ ){
	    this.stream[i] = Math.floor( Math.random() * 4 );
	}
	this.len = n;
    }
    
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
    }

    this.inBoard = function( x, y ){
	if ( x > this.x && x < this.x + this.width * this.cellSize &&
	     y > this.y && y < this.y + this.height * this.cellSize ){
	    return true;
	}
	return false;
    }
    this.getPos = function( x, y ){
	if ( this.inBoard( x, y ) ){
	    return { posX: Math.floor( ( x - this.x ) / this.cellSize ),
		     posY: Math.floor( ( y - this.y ) / this.cellSize ) };
	}
	return { posX: -1, posY: -1 };
    }
    this.drawArrow = function( posX, posY, ort, prop ){
	if ( posX < 0 || posX >= this.width || posY < 0 || posY >= this.height ){
	    return false;
	}
	
	c = { x: this.x + ( posX + 0.5 ) * this.cellSize, 
	      y: this.y + ( posY + 0.5 ) * this.cellSize };
	
	if ( prop.marked ){
	    ctrl.strokeStyle = "#FF0000";
	}else if ( prop.enabled ){
	    ctrl.strokeStyle = "#000000";
	}else{
	    ctrl.strokeStyle = "#AAAAAA";
	}
	ctrl.lineWidth = 2;
	ctrl.beginPath();
	
	var u = {x:0,y:0};
	var v0 = {x:0,y:0};
	var v1 = {x:0,y:0};
	u.y = -cellSize * 0.3;
	u.x = 0;
	v0 = this.align( u, ort );
	v0.x += c.x;
	v0.y += c.y;

	
	u.x = - cellSize * 0.2;
	u.y = 0;
	v1 = this.align( u, ort );
	v1.x += c.x;
	v1.y += c.y;
	ctrl.moveTo( v0.x, v0.y );
	ctrl.lineTo( v1.x, v1.y );

	u.x = cellSize * 0.2;
	u.y = 0;
	v1 = this.align( u, ort );
	v1.x += c.x;
	v1.y += c.y;
	ctrl.moveTo( v0.x, v0.y );
	ctrl.lineTo( v1.x, v1.y );


	u.y = cellSize * 0.3;
	u.x = 0;
	v1 = this.align( u, ort );
	v1.x += c.x;
	v1.y += c.y;
	ctrl.moveTo( v0.x, v0.y );
	ctrl.lineTo( v1.x, v1.y );

	ctrl.closePath();
	ctrl.stroke();
    }
    
    this.draw = function() {
	ctrl.strokeStyle = "#000000";
	ctrl.lineWidth = 1;
	ctrl.beginPath();
	
	for ( var i=0; i<=this.width; i++ ){
	    ctrl.moveTo( this.x + i * this.cellSize,
			 this.y );
	    ctrl.lineTo( this.x + i * this.cellSize,
			 this.y + this.height * this.cellSize );
	}

	for ( var i=0; i<=this.height; i++ ){
	    ctrl.moveTo( this.x,
			 this.y + i * this.cellSize );
	    ctrl.lineTo( this.x + this.width * this.cellSize,
			 this.y + i * this.cellSize );
	}
	
	ctrl.closePath();
	ctrl.stroke();


	var posX = 0;
	var posY = 0;
	var showTo = this.showFrom + this.width * this.height;
	if ( this.len < showTo ){
	    showTo = this.len;
	}

	
	for ( var i=this.showFrom; i<showTo; i++ ){
	    this.drawArrow( posX, posY, this.stream[i], this.property[i] );
	    posX++;
	    if ( posX == this.width ){
		posY++;
		posX = 0;
	    }
	}
    }

    this.update = function(){
	if ( 0 == this.status.click ){
	    if ( this.status.ready && mouseCtrl.leftPressed ){
		pos = this.getPos( mouseCtrl.x, mouseCtrl.y );
		if ( pos.posX >= 0 ){
		    this.status.click++;
		    this.status.id0 = this.showFrom + pos.posY * this.width + pos.posX;
		    for ( var i=this.showFrom; i<=this.status.id0; i++ ){
			this.property[i].enabled = false;
		    }
		    var showTo = this.showFrom + this.width * this.height;
		    if ( this.status.id0 + actions.maxLen < showTo ){
			for ( var i=this.status.id0 + actions.maxLen; i<showTo; i++ ){
			    this.property[i].enabled = false;
			}
		    }

		    this.property[this.status.id0].marked = true;
		    this.status.ready = false;
		}
	    }
	}else if ( 1 == this.status.click ){
	    if ( ! this.status.ready ){
		if ( ! mouseCtrl.leftPressed ){
		    this.status.ready = true;
		}
	    }else{
		if ( mouseCtrl.leftPressed ){
		    pos = this.getPos( mouseCtrl.x, mouseCtrl.y );
		    if ( pos.posX >= 0 ){

			var id = this.showFrom + pos.posY * this.width + pos.posX;
			if ( this.property[id].enabled ){
			    this.status.click++;
			    this.status.id1 = id;
			    for ( var i=this.status.id0+1; i<=this.status.id1; i++ ){
				this.property[i].enabled = false;
				this.property[i].marked = true;
			    }
			    this.status.ready = false;
			    actions.pushStream( this.stream, this.status.id0, this.status.id1 );
			    actions.push( 10, 0 );
			}
		    }
		}
	    }
	}
    }

    this.reset = function(){
	this.status.click = 0;
	this.status.ready = true;
	for ( var i=0; i<this.len; i++ ){
	    this.property[i].enabled = true;
	    this.property[i].marked = false;
	}
    }
}
MovementStream.prototype = new GameObject;


function ActionQueue( maxLen, x, y, cellSize ) {
    
    /// Action Code:
    /// -1 = Null
    /// 0, 1, 2, 3 = movement
    /// 10 = Melee Attack
    

    this.maxLen = maxLen;
    this.actions = new Array( this.maxLen );
    for ( var i=0; i<this.maxLen; i++ ){
	this.actions[i] = {code:0, param: 0};
    }
    this.len = 0;
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;

    this.status = { reeady: true };
    
    this.init();






    this.inBoard = function( x, y ){
	if ( x > this.x && x < this.x + this.maxLen * this.cellSize &&
	     y > this.y && y < this.y + this.cellSize ){
	    return true;
	}
	return false;
    }
    this.getID = function( x, y ){
	if ( this.inBoard( x, y ) ){
	    return Math.floor( ( x - this.x ) / this.cellSize );
	}
	return -1;
    }



    this.pushStream = function( a, start, end ) {
	this.len = end - start + 1;
	for ( var i=0; i<this.len; i++ ){
	    this.actions[i].code = a[start+i];
	}
    }
    this.push = function( code, param ){
	if ( this.len < this.maxLen - 1 ){
	    this.actions[this.len].code = code;
	    this.actions[this.len].param = param;
	    this.len++;
	}
    }
    
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
    }

    this.drawAttackIcon = function( id, ort ){
	c = { x: this.x + ( id + 0.5 ) * this.cellSize, 
	      y: this.y + 0.5 * this.cellSize };

	ctrl.strokeStyle = "#000000";
	ctrl.lineWidth = 1;
	ctrl.beginPath();
	
	var v = new Array(8);
	v[0] = { x: 0, y: -0.8 };
	v[1] = { x: -0.2, y: -0.6 };
	v[2] = { x: 0.2, y: -0.6 };
	v[3] = { x: -0.4, y: 0.5 };
	v[4] = { x: -0.2, y: 0.5 };
	v[5] = { x: 0.2, y: 0.5 };
	v[6] = { x: 0.4, y: 0.5 };
	v[7] = { x: 0, y: 0.8 };

	for ( var i=0; i<8; i++ ){
	    v[i] = this.align( v[i], ort );
	}
	
	var cellRadius = this.cellSize * 0.5;
	ctrl.moveTo( c.x + v[0].x * cellRadius,
		     c.y + v[0].y * cellRadius );
	ctrl.lineTo( c.x + v[1].x * cellRadius,
		     c.y + v[1].y * cellRadius );

	ctrl.moveTo( c.x + v[0].x * cellRadius,
		     c.y + v[0].y * cellRadius );
	ctrl.lineTo( c.x + v[2].x * cellRadius,
		     c.y + v[2].y * cellRadius );


	ctrl.moveTo( c.x + v[1].x * cellRadius,
		     c.y + v[1].y * cellRadius );
	ctrl.lineTo( c.x + v[4].x * cellRadius,
		     c.y + v[4].y * cellRadius );

	ctrl.moveTo( c.x + v[5].x * cellRadius,
		     c.y + v[5].y * cellRadius );
	ctrl.lineTo( c.x + v[2].x * cellRadius,
		     c.y + v[2].y * cellRadius );

	ctrl.moveTo( c.x + v[3].x * cellRadius,
		     c.y + v[3].y * cellRadius );
	ctrl.lineTo( c.x + v[6].x * cellRadius,
		     c.y + v[6].y * cellRadius );

	ctrl.moveTo( c.x + v[0].x * cellRadius,
		     c.y + v[0].y * cellRadius );
	ctrl.lineTo( c.x + v[7].x * cellRadius,
		     c.y + v[7].y * cellRadius );

	ctrl.closePath();
	ctrl.stroke();
	
    }

    this.drawArrow = function( id, ort ){
	c = { x: this.x + ( id + 0.5 ) * this.cellSize, 
	      y: this.y + 0.5 * this.cellSize };
	

	ctrl.strokeStyle = "#FF0000";
	ctrl.lineWidth = 2;
	ctrl.beginPath();
	
	var u = {x:0,y:0};
	var v0 = {x:0,y:0};
	var v1 = {x:0,y:0};
	u.y = -cellSize * 0.3;
	u.x = 0;
	v0 = this.align( u, ort );
	v0.x += c.x;
	v0.y += c.y;

	
	u.x = - cellSize * 0.2;
	u.y = 0;
	v1 = this.align( u, ort );
	v1.x += c.x;
	v1.y += c.y;
	ctrl.moveTo( v0.x, v0.y );
	ctrl.lineTo( v1.x, v1.y );

	u.x = cellSize * 0.2;
	u.y = 0;
	v1 = this.align( u, ort );
	v1.x += c.x;
	v1.y += c.y;
	ctrl.moveTo( v0.x, v0.y );
	ctrl.lineTo( v1.x, v1.y );


	u.y = cellSize * 0.3;
	u.x = 0;
	v1 = this.align( u, ort );
	v1.x += c.x;
	v1.y += c.y;
	ctrl.moveTo( v0.x, v0.y );
	ctrl.lineTo( v1.x, v1.y );

	ctrl.closePath();
	ctrl.stroke();
    }

    this.draw = function(){
	ctrl.strokeStyle = "#000000";
	ctrl.lineWidth = 1;
	ctrl.beginPath();
	
	for ( var i=0; i<=this.maxLen; i++ ){
	    ctrl.moveTo( this.x + i * this.cellSize,
			 this.y );
	    ctrl.lineTo( this.x + i * this.cellSize,
			 this.y + this.cellSize );
	}

	for ( var i=0; i<=1; i++ ){
	    ctrl.moveTo( this.x,
			 this.y + i * this.cellSize );
	    ctrl.lineTo( this.x + this.maxLen * this.cellSize,
			 this.y + i * this.cellSize );
	}

	ctrl.closePath();
	ctrl.stroke();

	for ( var i=0; i<this.len; i++ ){
	    if ( this.actions[i].code>=0 && this.actions[i].code<4 ){
		this.drawArrow( i, this.actions[i].code );
	    }else{
		this.drawAttackIcon( i, this.actions[i].param );
	    }
	}
    }

    this.update = function(){
	if ( this.status.ready ){
	    if ( mouseCtrl.leftPressed ){
		this.status.ready = false;
		var id = this.getID( mouseCtrl.x, mouseCtrl.y );
		if ( id >= 0 && this.actions[id].code == 10 ){
		    this.actions[id].param = ( this.actions[id].param + 1 ) % 4;
		}
	    }
	}else{
	    if ( !mouseCtrl.leftPressed ){
		this.status.ready = true;
	    }
	}
    }

    this.reset = function(){
	this.len = 0;
	this.status.ready = true;
    }
    
}
ActionQueue.prototype = new GameObject;


