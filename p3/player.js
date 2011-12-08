function Player(pos, dim, planeSize){
  this.pos = pos;
  this.roll = 0;
  this.pitch = 90;
  
  loadModel(this, "simplePlayer");

  if (shadows) {
    this.shaderName = "player_shadow";
  } else {
    this.shaderName = "player";
  }
  this.shadow = false;
  this.init3d();  

  this.lastPress = 0;
  this.light = new Light(pos);
  var planeSize = planeSize;
  var roomSize = 5;
  this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
  this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
  this.enterCool = 0;

  this.update = function(){	
    var speed = 0.09;
    var roomEdge = planeSize/2 -.25;
    //instead of making it continuous... make it snap?
    //console.log("pos ="+this.pos[0]+" planelim =" +-planeSize/2);
    if(keyboard.left && this.pos[0]>-roomEdge) {
      this.pos[0] -= speed;
      this.roll = 180;
    } else if(keyboard.right && this.pos[0]<roomEdge) {
      this.pos[0] += speed;
      this.roll = 0;
    } else if(keyboard.up && this.pos[1]<roomEdge) {
      this.pos[1] += speed;
      this.roll = 90;
    } else if(keyboard.down && this.pos[1]>-roomEdge) {
      this.pos[1] -= speed;
      this.roll = -90;
    }
    var cooldown = 10;
    this.light.pos = [this.pos[0], this.pos[1], this.pos[2]+2];

    // use to compare light settings using spacebar. 
    if (keyboard.space && game.tick - player.lastPress > cooldown) {
      player.lastPress = game.tick;
    }
    
    //am I at the edge? if so...
    //south
    //currentRoom.
    
    if(this.roomx==2 && this.roomy==0 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("s")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y+1][currentRoom.x];
      currentRoom.enable();
      console.log("moving down");
      this.pos[1]=planeSize/2;
    }
    
    //north
    if(this.roomx==2 && this.roomy==4 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("n")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y-1][currentRoom.x];
      currentRoom.enable();
      console.log("moving on up");
      this.pos[1]=-planeSize/2;
    }
    //West
    if(this.roomx==0 && this.roomy==2 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("w")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y][currentRoom.x-1];
      currentRoom.enable();
      console.log("moving west");
      this.pos[0]=planeSize/2;
    }
    
    //east
    if(this.roomx==4 && this.roomy==2 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("e")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y][currentRoom.x+1];
      currentRoom.enable();
      console.log("moving east");
      this.pos[0]=-planeSize/2;
    }
    

    this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
    this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
  }
  
  this.draw = function(){
    
    /*ctx.drawImage(roomImg,0,0,150,150);
     if(currentRoom.type.indexOf("n")!=-1){ctx.drawImage(emptyImg, 150/2-15, 0);}
     if(currentRoom.type.indexOf("s")!=-1){ctx.drawImage(emptyImg, 150/2-15, 120);}
     if(currentRoom.type.indexOf("e")!=-1){ctx.drawImage(emptyImg, 120, 150/2-15);}
     if(currentRoom.type.indexOf("w")!=-1){ctx.drawImage(emptyImg, 0, 150/2-15);}*/
    var offsetx = currentRoom.x - 2;
    var offsety = currentRoom.y - 2;
    for(var y = 0; y<5; y++){
      for(var x = 0; x<5; x++){
    	var someRoom = level.dungeon[offsety+y][offsetx+x];
    	if(someRoom == null){
    	  ctx.drawImage(emptyImg,offsetx+x*30,offsety+y*30);
    	}
    	else{
    	  ctx.drawImage(roomImg,offsetx+x*30,offsety+y*30);
    	  ctx.fillStyle    = '#f00';
	  ctx.font = "bold 26px"
    	  if(someRoom.type.indexOf("n")!=-1){ctx.fillText("n",offsetx+x*30+15,offsety+y*30+5);}
    	  if(someRoom.type.indexOf("s")!=-1){ctx.fillText("s",offsetx+x*30+15,offsety+y*30+28);}
    	  if(someRoom.type.indexOf("e")!=-1){ctx.fillText("e",offsetx+x*30+25,offsety+y*30+15);}
	  if(someRoom.type.indexOf("w")!=-1){ctx.fillText("w",offsetx+x*30,offsety+y*30+15);}
	  if(someRoom.x == currentRoom.x && someRoom.y == currentRoom.y){ctx.fillText("*",offsetx+x*30+15,offsety+y*30+20);}

    	  //if(currentRoom.type.indexOf("s")!=-1){ctx.fillRect(offsetx+x*30+12,offsety+y*30,offsetx+x*30,offsety+y*30+30);}
    	  //if(currentRoom.type.indexOf("e")!=-1){ctx.fillRect(offsetx+x*30,offsety+y*30,offsetx+x*30,offsety+y*30);}
    	  //if(currentRoom.type.indexOf("w")!=-1){ctx.fillRect(offsetx+x*30+4,offsety+y*30,offsetx+x*30,offsety+y*30);}
	  //context.fillText(level.dungeon[y][x].type, x*30, y*30+15);
    	}
      }
    }

    // draw player model
    mPushMatrix();

    mat4.translate(mMatrix, this.pos);
    mat4.rotate(mMatrix, degToRad(this.roll), [0, 0, 1]);
    mat4.rotate(mMatrix, degToRad(this.pitch), [1, 0, 0]);

    this.draw3d();
    mPopMatrix();
    
  };

}

Player.prototype = new GameObject3D;
