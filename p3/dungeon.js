function Dungeon(max, pxRoomSize){
  this.dungeon = new Array();
  //make this thing max*max
  for(var y = 0; y<max; y++){
    this.dungeon[y] = new Array();
  }
  
  this.spawnX = Math.round(max/2);
  this.spawnY = Math.round(max/2);
  
  //push first... set currentY
  
  var currentX = this.spawnX;
  var currentY = this.spawnY;
  
  var roomCount = 1;
  var roomsToMake = new Array();
  console.log("in the dungeon maker max: "+max);
  console.log("max ="+(max-roomCount));
  
  var thisRoom = new GameRoom("", currentX, currentY, pxRoomSize);
  this.dungeon[currentY][currentX] = thisRoom;
  roomsToMake.push(thisRoom);

  this.exitRoom = [0,0];

  var iter = 0;

  while(roomsToMake.length!=0 && roomCount < size && iter<100){
    console.log("making another room");
    thisRoom = roomsToMake.pop();
    currentX = thisRoom.x;
    currentY = thisRoom.y;
    iter++;
    //var exitRoom = thisRoom.exitRoom;
    //get the room's string
    var roomString = genRoomString((max-roomCount), thisRoom.type, currentX, currentY);
    this.dungeon[currentY][currentX] = new GameRoom(roomString, currentX, currentY, pxRoomSize);
    
   // if(roomCount == 10){
    	//console.log("exit room at x="+currentX+" y ="+currentY);
    	this.exitRoom = [currentY,currentX];
    //}
    
    //keep a stack of rooms to be created (one for every possible dir)
    for(var x = 0; x<roomString.length; x++){
      var nextX = currentX;
      var nextY = currentY;
      var nextType="";
      
      //get the new room's coordinates
      if(roomString.charAt(x)=='s'){nextY +=1; nextType +='n';}
      if(roomString.charAt(x)=='n'){nextY -=1; nextType +='s';}
      if(roomString.charAt(x)=='w'){nextX -=1; nextType +='e';}
      if(roomString.charAt(x)=='e'){nextX +=1; nextType +='w';}
      
      //check to see if it's not already being made...
      if(this.dungeon[nextY][nextX]!=null){
		nextType = mergeStrings(this.dungeon[nextY][nextX].type, nextType);
		exitRoom = this.dungeon[nextY][nextX].exitRoom;
      }
      else{
		roomCount ++;
      }
      
      roomsToMake.push(new GameRoom(nextType, nextX, nextY, pxRoomSize))
      
      this.dungeon[nextY][nextX] = new GameRoom(nextType, nextX, nextY, pxRoomSize);
    }
  }
  //debugger;
  this.dungeon[this.exitRoom[0]][this.exitRoom[1]].setExitRoom();
    
  
  
}
