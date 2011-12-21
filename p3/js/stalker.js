function Stalker(spawnRoom){
  var planeSize = 15;
  var roomEdge = planeSize/2 -.25;
  this.room = spawnRoom;
  this.dirSet = false;
  this.dir = null;
  this.stalking = false;;
  this.destination = [0,0];
  this.pos = [0.0,0.0, 2.0];
  var addedDelay = 0;
  this.roll = 0;
  this.pitch = 90;
  this.soundIndex = "eating";
  this.damage = 70;
  this.firstStalk = true;
  
  this.shaderName = "enemy";
  //get a random tile in the spawn room to spawn the stalker
  //set the pos
  //playerDirection
  loadModel(this, "anglerFish");
  var moveCounter = 0;
  this.color3d = [.5, 0, .5];
  this.shaderName = "enemy";
  this.speed = 0.03;
  
  this.init3d();  
  
  this.update = function(){
    
    if(showFlash){
      return;
    }
    
    //if player is in the same room
    if(currentRoom == this.room){
      this.render = true;
      this.shadow = true;
      this.stalking = true;
      dirSet = false;
      if(this.firstStalk&&numberWins<1){
	splashImage = stalkerSplash;
	showFlash = true;
	game.pause();
	this.firstStalk = false;
      }else{
	player.hud.showMessage("The stalker returns");
      }
    }
    //else, move towards a random door
    else{
      this.render = false;
      this.shadow = false;
      if(!this.dirSet){
	if(this.room != null){
	  var dirIndex = (Math.floor(Math.random()*this.room.type.length));
	  this.dir = this.room.type.charAt(dirIndex);
	}
      }
      moveCounter = (moveCounter + 1) % (75 + addedDelay);
    }
    
    //move towards your destination
    if(this.stalking){
      if(currentRoom == this.room){
	var destX = parseFloat(player.pos[0]) - parseFloat(this.pos[0]);
	var destY = parseFloat(player.pos[1]) - parseFloat(this.pos[1]);
	var norm = Math.sqrt(Math.pow(destX, 2.0) + Math.pow(destY, 2.0));
	if(norm <= .001){
	  norm = .001;
	}
	destXNorm = parseFloat(parseFloat(destX) / parseFloat(norm));
	destYNorm = parseFloat(parseFloat(destY) / parseFloat(norm));
	
	destX = destXNorm * parseFloat(this.speed);
	destY = destYNorm * parseFloat(this.speed);
	
	this.roll = ((Math.atan(destYNorm / destXNorm) * 180) / Math.PI);
	this.roll += destX < 0 ? 180 : 0;
	
	this.pos[0] += parseFloat(destX);
	this.pos[1] += parseFloat(destY);
      }
      else{
	if(Math.abs(this.room.x - currentRoom.x) + Math.abs(this.room.y - currentRoom.y) <= 1 && moveCounter === 0){
	  addedDelay += 9;
	  //west
	  if(currentRoom.x - this.room.x < 0){
	    this.pos[0] = roomEdge;
	    this.pos[1] = 0;
	  }//east
	  else if(currentRoom.x - this.room.x > 0){
	    this.pos[0] = -roomEdge;
	    this.pos[1] = 0;
	  }
	  //south
	  else if(currentRoom.y - this.room.y < 0){
	    this.pos[0] = 0;
	    this.pos[1] = -roomEdge;
	  }
	  //north
	  else if(currentRoom.y - this.room.y > 0){
	    this.pos[0] = 0;
	    this.pos[1] = roomEdge;
	  }
	  
	  this.room = currentRoom;
	}
	else if(Math.abs(this.room.x - currentRoom.x) + Math.abs(this.room.y - currentRoom.y) > 1){
	  this.stalking = false;
	}
      }
    }
    else if(moveCounter == 0){
      addedDelay = 15;
      switch(this.dir){
      case 'n':
	this.room = level.dungeon[this.room.y - 1][this.room.x];
	this.pos[0] = 0;
	this.pos[1] = -roomEdge;
	break;
      case 's':
	this.room = level.dungeon[this.room.y + 1][this.room.x];
	this.pos[0] = 0;
	this.pos[1] = roomEdge;
	break;
      case 'e':
	this.room = level.dungeon[this.room.y][this.room.x + 1];
	this.pos[0] = -roomEdge;
	this.pos[1] = 0;
	break;
      case 'w':
	this.room = level.dungeon[this.room.y][this.room.x - 1];
	this.pos[0] = roomEdge;
	this.pos[1] = 0;
	break;
      }
      this.dirSet = false;
    }
    
    //check to see if it has hit a door.
    //if so, move to a new room and set the dirset to false
    
    //if it collides with the player....?
  }
  
  this.draw = function() {
    mPushMatrix();

    mat4.translate(mMatrix, this.pos);
    mat4.rotate(mMatrix, degToRad(this.roll), [0, 0, 1]);
    mat4.rotate(mMatrix, degToRad(this.pitch), [1, 0, 0]);

    this.draw3d();
    mPopMatrix();
  }
}

Stalker.prototype = new GameObject3D;
