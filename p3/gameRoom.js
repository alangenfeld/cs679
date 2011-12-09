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
  
  for(var i = 0; i<size; i++) {
    this.grid[i] = new Array(5);
  }
  
  //add items to the room here randomly
  
  var randX = Math.round(Math.random()*4);
  var randY = Math.round(Math.random()*4);
  
  var someBox = new Box([(randX-2)*(pxSize/5),(randY-2)*(pxSize/5),0], [pxSize/5,pxSize/5,1]);
  
  var boxColorProb = Math.random();
  
  if(boxColorProb>1/3*2){
    someBox.shutdown();
    someBox = new ColorBox([(randX-2)*(pxSize/5),(randY-2)*(pxSize/5),0], [pxSize/5,pxSize/5,1],[0,0,1]);
  }
  if(boxColorProb>1/3&&boxColorProb<1/3*2){
    someBox.shutdown();
    someBox = new ColorBox([(randX-2)*(pxSize/5),(randY-2)*(pxSize/5),0], [pxSize/5,pxSize/5,1],[0,1,0]);
  }
  
  //we minus 3 to center it
  //TODO can we disable a box so that the current room's box is the only one shown?
  
  someBox.render = false;
  someBox.shadow = false;

  this.grid[randX][randY] = someBox;
  
  this.box = someBox;
  
  //we can also decide what kind of room it is here. puzzle room etc

  this.checkCollisionAt = function(x,y){
    //console.log("x = "+x+" y="+y);
    //if(this.grid[x][y]!=null){
    //thing = this.grid[x][y];
    //thing.collide();?
    //check type and do somehting based on that?
    //}
  };

  this.update = function() {
    // this uses references to the global variables in game.js
    currentRoom.checkCollisionAt(player.roomx, player.roomy);
  };
  
  this.enable = function(){
    var walls = [false, false, false, false];
    this.visited = true;
    if(this.type.indexOf("n")!=-1){walls[0]=true;}
    if(this.type.indexOf("e")!=-1){walls[1]=true;}
    if(this.type.indexOf("w")!=-1){walls[2]=true;}
    if(this.type.indexOf("s")!=-1){walls[3]=true;}
    
    this.roomRender = new Room(pxRoomSize, walls);
    //this.roomRender.render = false;
    //this.roomRender.shadow = false;
    
    for(var a = 0; a<size; a++){
      for(var b = 0; b<size; b++){
		var object = this.grid[a][b];
		if(object != null){
		  object.render = true;
		  object.shadow = true;
		}
      }
    }
    this.box.render = true;
    console.log("moving to the next room with type : "+currentRoom.type+" at x ="+currentRoom.x+" y="+currentRoom.y + " exit room = "+currentRoom.exitRoom);
  };
  
  this.setExitRoom = function(){
  	console.log("Setting up the exit room");
  	this.exitRoom = true;
  	var someBox = new ColorBox([this.box.pos[0],this.box.pos[1],2], [pxSize/5,pxSize/5,1],[10,0,0]);
  	someBox.rotating = true;
  	//this.grid[this.box.pos[0]][this.box.pos[1]] = someBox;
  	this.box.shutdown();
  	this.box = someBox;
  	this.box.render = false;
  	this.box.shadow = false;
  }
  
  this.disable = function(){
  	this.box.render = false;
    this.roomRender.shutdown();
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
