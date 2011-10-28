function MovementStream( x, y, cellSize, w, h ) {
  
  this.streams = new Array(500);
  for ( var i=0; i<500; i++ ){
    this.streams[i] = 0;
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
  
  
  

  resourceManager.addImage("basic", "img/basic.png");
  resourceManager.addImage("special1", "img/special1.png");
  resourceManager.addImage("special2", "img/special2.png");
  this.init();
  
  /// Randomly generate movement streams
  this.generate = function( n ) {
    for ( var i=0; i<n ;i++ ){
      this.streams[i] = Math.floor( Math.random() * 4 );
    }
    this.len = n;
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
  
  this.inBoard = function( x, y ){
      if ( x > this.x && x < this.x + this.width * this.cellSize &&
	    y > this.y && y < this.y + (this.height+1) * this.cellSize) {
	  
	  return true;
      } return false;
  };
  
  this.getPos = function( x, y ){
    if ( this.inBoard( x, y ) ){
	return { posX: Math.floor( ( x - this.x ) / this.cellSize ),
		 posY: Math.floor( ( y - this.y ) / this.cellSize ) };
    }
    return { posX: -1, posY: -1 };
  };
  
  this.drawArrow = function( posX, posY, ort, prop ){
      if ( posX < 0 || posX >= this.width || posY < 0 || posY >= this.height ){
	  return;
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
  };
  
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
      
      // attacks and clear

      for(var i = 0; i<=this.width; i = i +4){
	  
	  ctrl.moveTo(this.x + i * this.cellSize, this.y);
	  ctrl.lineTo(this.x+ i *this.cellSize, this.y + 6*this.cellSize);} 
      
      ctrl.closePath();
      ctrl.stroke();
      
      
      //go button
      ctrl.beginPath();
      
      ctrl.moveTo(550 + 11* this.cellSize, 40);
      ctrl.lineTo(550 + 11* this.cellSize, 40 + this.cellSize);
      
      ctrl.moveTo(550 + 13* this.cellSize, 40);
      ctrl.lineTo(550 +13* this.cellSize, 40+this.cellSize);
    
      for ( var i=0; i<=1; i++ ){
	  ctrl.moveTo( 550+ 11*this.cellSize ,
		       40 + i * this.cellSize );
	  ctrl.lineTo( 550 + 13 * this.cellSize,
		       40 + i * this.cellSize );
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
	  this.drawArrow( posX, posY, this.streams[i], this.property[i] );
	  posX++;
	  if ( posX == this.width ){
	      posY++;
	posX = 0;
	  }
      }
      ctrl.fillStyle = '#f00';
      ctrl.font = 'bold 30px sans-serif';
      ctrl.fillText('CLEAR', this.x +1.5, (this.height +1.5)*this.cellSize);

      ctrl.fillStyle = '#f00';
      ctrl.font = 'bold 14px sans-serif';
      ctrl.fillText('Melee', this.x +4.5*this.cellSize, (this.height +1.5)*this.cellSize);
      
      ctrl.fillStyle = '#f00';
      ctrl.font = 'bold 14px sans-serif';
      ctrl.fillText('Sweep', this.x +8.5*this.cellSize, (this.height +1.5)*this.cellSize);
      
      ctrl.fillStyle = '#f00';
      ctrl.font = 'bold 14px sans-serif';
      ctrl.fillText('Range', this.x +12.5*this.cellSize, (this.height +1.5)*this.cellSize);
            
      ctrl.fillStyle = '#00ff00'; 
      ctrl.font= 'bold 30px sans-serif';
      ctrl.fillText('GO!', 550 +(11 * this.cellSize), 65);
      
      //attack images
      ctrl.drawImage(resourceManager.getImage("basic"), this.x + 6.5*this.cellSize, (this.height+.75)*this.cellSize);
      ctrl.drawImage(resourceManager.getImage("special1"), this.x + 10.5*this.cellSize, (this.height+.75)* this.cellSize);
      ctrl.drawImage(resourceManager.getImage("special2"), this.x + 14.5*this.cellSize, (this.height+.75) * this.cellSize);

  };
  
  
  this.update = function(){
      pos = this.getPos( mouseCtrl.x, mouseCtrl.y );
      if(pos.posX < 4 && pos.posY>4&& mouseCtrl.leftPressed){
	this.reset();
	logic.dispatchEvent( { name: "Clear" } );
      } else if(pos.posX>= 4 && pos.posX <=7&& pos.posY > 4&& mouseCtrl.leftPressed){
	  actions.push(10,0);
      } else if(pos.posX>= 8 && pos.posX <= 11&& pos.posY > 4&& mouseCtrl.leftPressed){
	  actions.push(11,0);
      } else if(pos.posX>= 12 && pos.posX <= 16&& pos.posY > 4 && mouseCtrl.leftPressed){
	  actions.push(12,0);
      } else if(mouseCtrl.x>= 880 && mouseCtrl.x<=940 && mouseCtrl.y >= 40 && mouseCtrl.y <=70 && mouseCtrl.leftPressed){
	if (logic.stage == 0) {
	  logic.dispatchEvent( { name: "To Action Mode" } );
	}
      } else if ( 0 == this.status.click ){
	if ( this.status.ready && mouseCtrl.leftPressed ){
	  if ( pos.posX >= 0&& pos.posY<=4 ){
	  this.status.click++;
	  this.status.id0 = this.showFrom + pos.posY * this.width + pos.posX;
	  this.status.id1 = this.status.id0;
	  actions.pushStream( this.streams, this.status.id0, this.status.id1 );
	  for ( var i=this.showFrom; i<this.status.id0; i++ ){
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
      }	else if ( mouseCtrl.leftPressed ){
	if ( pos.posX >= 0 ){
	  var id = this.showFrom + pos.posY * this.width + pos.posX;
	  if ( this.property[id].enabled ){
	    if (actions.attackSet && actions.attackLoc > 0) {
	      actions.attackSet = false;
	    }
	    for ( var i=this.status.id0+1; i<=this.status.id1; i++ ){
	      this.property[i].marked = false;
	    }
	    this.status.id1 = id;
	    for ( var i=this.status.id0+1; i<=this.status.id1; i++ ){
	      this.property[i].marked = true;
	    }

	    this.status.ready = false;

	    actions.pushStream( this.streams, this.status.id0, this.status.id1 );
	  }
	}
      }
    }
  };
  
  this.reset = function(){
    this.status.click = 0;
    this.status.ready = true;
    for ( var i=0; i<this.len; i++ ){
      this.property[i].enabled = true;
      this.property[i].marked = false;
    }
  };
}
MovementStream.prototype = new GameObject;
function ActionQueue( maxLen, x, y, cellSize ) {
  
  /// Action Code:
  /// -1 = Null
  /// 0, 1, 2, 3 = movement
  /// 10 = Melee Attack
  
  
  /// Model:
  this.maxLen = maxLen;
  this.actions = new Array( this.maxLen );
  for ( var i=0; i<this.maxLen; i++ ){
    this.actions[i] = {code:0, param: 0};
  }
  this.len = 0;

  /// View:
  this.x = x;
  this.y = y;
  this.cellSize = cellSize;
  this.status = { ready: true };
  this.attackSet = false;
  this.attackLoc = 0;
  this.init();
    
  this.inBoard = function( x, y ){
    if ( x > this.x && x < this.x + this.maxLen * this.cellSize &&
	 y > this.y && y < this.y + this.cellSize ){
	   return true;
	 }
    return false;
  };

  this.getIDByPosition = function( x, y ){
    if ( this.inBoard( x, y ) ){
      return Math.floor( ( x - this.x ) / this.cellSize );
    }
    return -1;
  };

  this.pushStream = function( a, start, end ) {
    var beginning = (this.attackSet && this.attackLoc == 0) ? 1 : 0;
    this.len = end - start + 1 + beginning;
    for(var i = 0; i < this.len; i++){
      this.actions[i+beginning].code = a[start+i];
    }
    logic.dispatchEvent( {name: "Actions Update"} );
  };

  this.push = function( code, param ){
    if (this.len >= this.maxLen) {
      return;
    }
    if (!this.attackSet) {
      this.actions[this.len].code = code;
      this.actions[this.len].param = param;
      this.attackSet = true;
      this.attackLoc = this.len;
      this.len++;
    } else {
      this.actions[this.attackLoc].code = code;
      this.actions[this.attackLoc].param = param;
    }
    logic.dispatchEvent( { name: "Actions Update" } );
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
    
  };

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
  };

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
  };

  this.update = function(){
    /*
     if ( this.status.ready ){
     if ( mouseCtrl.leftPressed ){
     this.status.ready = false;
     var id = this.getIDByPostion( mouseCtrl.x, mouseCtrl.y );
     if ( id >= 0 && this.actions[id].code == 10 ){
     this.actions[id].param = ( this.actions[id].param + 1 ) % 4;
     }
     }
     }else{
     if ( !mouseCtrl.leftPressed ){
     this.status.ready = true;
     }
     }
     */
  };

  this.reset = function(){
    this.len = 0;
    this.attackSet = false;
    this.status.ready = true;
  };
  
}
ActionQueue.prototype = new GameObject;


