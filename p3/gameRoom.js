function GameRoom(type, x, y, pxSize){
  //say this is a 6x6 room
  //(0,0) is bottom left
  var size = 5;
  this.type = type;
  this.x = x;
  this.y = y;
  this.grid = new Array(5);
  this.visited = false;
  this.init();
  this.exitRoom = false;
  this.box = null;
  this.key = null;
  
  for(var i = 0; i<size; i++) {
    this.grid[i] = new Array(5);
  }
  
  //add items to the room here randomly  
  
  var randX = Math.round(Math.random()*4);
  var randY = Math.round(Math.random()*4);
  
  var boxColorProb = Math.random();
  
  if(boxColorProb>1/3&&boxColorProb<1/3*2){
    someBox = new ColorBox([(randX-2)*(pxSize/5),(randY-2)*(pxSize/5),0], [pxSize/5,pxSize/5,1],[0,1,0]);
    someBox.render = false;
  	someBox.shadow = false;
  	this.grid[randX][randY] = someBox;
  	this.box = someBox;
  }
  
    //Adding in enemies based on a dice roll..
  this.enemyArray = new Array();
  if(Math.random() < 0.7 ){
	var enemyType = Math.random() * 4.0;
	
	//Enemy 1 - Enemies that just wander around.
	if(enemyType <= 1.0){
				//Determine the number of enemies
		var numEnemies = Math.floor(Math.random() * 4.0 + 1.0);
		for(var i = 0; i < numEnemies; i++){
			var randE0X = Math.round(Math.random() * 4.0);
			var randE0Y = Math.round(Math.random() * 4.0);
			this.enemyArray.push(new Enemy(	[(randE0X-2)*(pxSize/5),(randE0Y-2)*(pxSize/5),1], 
											[pxSize/5,pxSize/5,1], ai0, this));
		}
	}
	//Enemy 2 - Fast enemies that fly at you
	else if(enemyType <= 2.0){
		//Determine the number of enemies
		var numEnemies = Math.floor(Math.random() * 5.0 + 2.0);
		for(var i = 0; i < numEnemies; i++){
			var randE0X = Math.round(Math.random() * 4.0);
			var randE0Y = Math.round(Math.random() * 4.0);
			this.enemyArray.push(new Enemy(	[(randE0X-2)*(pxSize/5),(randE0Y-2)*(pxSize/5),1], 
											[pxSize/5,pxSize/5,1], ai1, this));
		}
	}
	//Enemy 2 - Enemies that go north and south.
	else if(enemyType <= 3.0){
		//Determine the number of enemies
		var numEnemies = Math.floor(Math.random() * 5.0 + 5.0);
		this.enemyArray.push(new Enemy(	[(-2.0)*(pxSize/5),0,1], 
										[pxSize/5,pxSize/5,1], ai2, this));
		this.enemyArray.push(new Enemy(	[(-1.3)*(pxSize/5),0,1], 
										[pxSize/5,pxSize/5,1], ai2, this));
		this.enemyArray.push(new Enemy(	[(-0.6)*(pxSize/5),0,1], 
										[pxSize/5,pxSize/5,1], ai2, this));
		this.enemyArray.push(new Enemy(	[(0.1)*(pxSize/5),0,1], 
										[pxSize/5,pxSize/5,1], ai2, this));
		this.enemyArray.push(new Enemy(	[(0.8)*(pxSize/5),0,1], 
										[pxSize/5,pxSize/5,1], ai2, this));
		this.enemyArray.push(new Enemy(	[(1.5)*(pxSize/5),0,1], 
										[pxSize/5,pxSize/5,1], ai2, this));
		this.enemyArray.push(new Enemy(	[(2.2)*(pxSize/5),0,1], 
										[pxSize/5,pxSize/5,1], ai2, this));
	}
	//Enemy 3 - Bouncing enemies.
	else if(enemyType <= 4.0){
		//Determine the number of enemies
		var numEnemies = Math.floor(Math.random() * 5.0 + 5.0);
		for(var i = 0; i < numEnemies; i++){
			var randE0X = Math.round(Math.random() * 4.0);
			var randE0Y = Math.round(Math.random() * 4.0);
			this.enemyArray.push(new Enemy(	[(randE0X-2)*(pxSize/5),(randE0Y-2)*(pxSize/5),1], 
											[pxSize/5,pxSize/5,1], ai3, this));
		}
	}
  }
  
  
  for(var enemy in this.enemyArray){
	this.enemyArray[enemy].render = false;
	this.enemyArray[enemy].shadow = false;
  }
  
  //we can also decide what kind of room it is here. puzzle room etc

  this.checkCollisionAt = function(x,y){
    
  };

  
  var ecluDist = function(pos0, pos1){
	return Math.sqrt(Math.pow(pos0[0] - pos1[0], 2.0) + Math.pow(pos0[1] - pos1[1], 2.0));
  }
  
  this.checkEnemyCollisions = function(){
	for(var enemy in this.enemyArray){
		var eclu = ecluDist(this.enemyArray[enemy].pos, player.pos);
		if(eclu < 0.7){
			player.takeDamage(this.enemyArray[enemy]);
		};
	}
	if(stalker.room === this){
		if(ecluDist(stalker.pos, player.pos) < 1.0){
			player.takeDamage(stalker);
		}
	}
  }
  
  
  this.update = function() {
    // this uses references to the global variables in game.js
    //currentRoom.checkCollisionAt(player.roomx, player.roomy);
	currentRoom.checkEnemyCollisions();
	if(player.hasKey&&this.key!=null){
		this.key.render = false;
		this.key.shadow = false;
	}
  };
  
  this.enable = function(){
    var walls = [false, false, false, false];
    this.visited = true;
    if(this.type.indexOf("n")!=-1){walls[0]=true;}
    if(this.type.indexOf("e")!=-1){walls[1]=true;}
    if(this.type.indexOf("w")!=-1){walls[2]=true;}
    if(this.type.indexOf("s")!=-1){walls[3]=true;}
    
    if(this.key != null && !player.hasKey){
  		this.key.render = true;
		this.key.shadow = true;
	}
    
	for(var enemy in this.enemyArray){
		this.enemyArray[enemy].render = true;
		this.enemyArray[enemy].shadow = true;
		this.enemyArray[enemy].enabled = true;
	}
	
    if(currentRoom.exitRoom){
    	this.roomRender = new Room(pxRoomSize, walls, "puzzleWall.png");
    }
    else{
    	this.roomRender = new Room(pxRoomSize, walls, "wall.png");
    }
    
    for(var a = 0; a<size; a++){
      for(var b = 0; b<size; b++){
		var object = this.grid[a][b];
		if(object != null){
		  object.render = true;
		  object.shadow = true;
		}
      }
    }
    console.log("moving to the next room with type : "+currentRoom.type+" at x ="+currentRoom.x+" y="+currentRoom.y + " exit room = "+currentRoom.exitRoom);
  };
  
  this.setKeyRoom = function(){
    	var someBox = new ColorBox([(randX-2)*(pxSize/5),(randY-2)*(pxSize/5),0], [pxSize/5,pxSize/5,1],[0,0,1]);
    	this.key = someBox;
    	this.key.rotating = true;
	  	this.key.render = false;
		this.key.shadow = false;
  }
  
  this.setExitRoom = function(){
  	console.log("Setting up the exit room");
  	this.exitRoom = true;
  	var someBox = new ColorBox([0,0,1], [2,2,2],[2,2,2]);
  	someBox.rotating = true;
  	if(this.box != null){
  		this.box.shutdown();
  	}
  	this.box = someBox;
  	this.box.render = false;
  	this.box.shadow = false;
  }
  
  this.disable = function(){
  if(this.key != null){
  	this.key.render = false;
	this.key.shadow = false;
  }
    this.roomRender.shutdown();
		for(var enemy in this.enemyArray){
		this.enemyArray[enemy].render = false;
		this.enemyArray[enemy].shadow = false;
		this.enemyArray[enemy].enabled = false;
	}
    for(var a = 0; a<size; a++){
      for(var b = 0; b<size; b++){
	var object = this.grid[a][b];
	if(object != null){
	  object.render = false;
	  object.shadow = false;
	}
      }
    }
  };
}



function genRoomString(max, currentType, x, y){
  if(max < 1)return currentType;
  var draw = "nsew";
  //console.log("room at "+x+" "+y);
  
  draw = difStrings(draw, currentType);
  
  //can't go north
  if(y==0){draw = draw.replace("n","");}
  //can't go south
  if(y==size-1){draw = draw.replace("s","");}
  //can't go west
  if(x==0){draw = draw.replace("w","");}
  //can't go west
  if(x==size-1){draw = draw.replace("e","");}
  
  //console.log("possible = "+draw);
  var numDir = draw.length;
  var count = Math.round(Math.random()*numDir);
  if(count<1)count = 1;
  if(max<count)count = max;
  //console.log("count = "+count);
  for(var x = 0; x<count; x++){
    var index = Math.round(Math.random()*(draw.length-1));
    currentType = currentType + draw.charAt(index);
    draw = draw.replace(draw.charAt(index),"");
  }
  //console.log("type = "+currentType);
  return currentType;
}

function mergeStrings(a,b){
  for(var i = 0; i<b.length; i++){
    if(a.indexOf(b.charAt(i))== -1){
      a = a + b.charAt(i);
    }
  }
  return a;
}

function difStrings(a,b){
  for(var i = 0; i<b.length; i++){
    a = a.replace(b.charAt(i),"");
  }
  return a;
}

GameRoom.prototype = new GameObject;
