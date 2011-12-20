function Player(pos, dim, planeSize){

  this.pos = pos;
  this.roll = 0;
  this.pitch = 90;
  this.maxSanity = 100;
  this.sanity = 100;
  this.sanityRegen = .01;
  this.damageCounter = 0;
  
  loadModel(this, "simplePlayer");

  this.shaderName = "player";

  // somebody should change this probably
  this.color3d = [.8, .2, .2];

  this.shadow = false;
  this.init3d();  

  this.lastPress = 0;
  this.light = new Light(pos);

  // set the light to a warm color
  this.light.col = [.8, .6, .5];
  this.lightOffset = 0.5;

  var planeSize = planeSize;
  var roomSize = 5;
  this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
  this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
  this.enterCool = 0;

  this.update = function(){	
	//Decrement the damage counter so we can take damage again.
	if(this.damageCounter > 0){
		this.damageCounter--;
	}
    var speed = 0.12;
    var roomEdge = planeSize/2 -.25;
    //instead of making it continuous... make it snap?
    //console.log("pos ="+this.pos[0]+" planelim =" +-planeSize/2);

    // if crazy game over
    if (this.sanity <= 0) {
      gameOver();
    }
    if (this.sanity < 100){
      this.sanity += this.sanityRegen;      
    }

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
    this.light.pos = [this.pos[0], this.pos[1], this.pos[2]+this.lightOffset];

    // use to compare light settings using spacebar. 
    if (keyboard.space && game.tick - player.lastPress > cooldown) {
      player.lastPress = game.tick;
    }
    
    //check end condition
      // was having problems with this
/*    if(this.roomx==Math.round(currentRoom.box.pos[0]/(planeSize/roomSize)+2)
    	&& this.roomy==Math.round(currentRoom.box.pos[0]/(planeSize/roomSize)+2) 
    	&& keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.exitRoom)){
    	//TODO display something like YOU ARE WINNER ALL YOUR BASES
      win();
    }
    */
    if (keyboard.enter && (currentRoom.exitRoom)){
      win();
    }

    //am I at the edge? if so...
    //south
    //currentRoom.
    
    roomEdge -= .25
    
//    if(this.roomx==2 && this.roomy==0 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("s")!=-1)){
	if(this.pos[0]>-1 && this.pos[0]<1 && this.pos[1]<-roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("s")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y+1][currentRoom.x];
      currentRoom.enable();
      console.log("moving down");
      this.pos[1]=(roomEdge);
    }
    
    //north
//    if(this.roomx==2 && this.roomy==4 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("n")!=-1)){
    if(this.pos[0]>-1 && this.pos[0]<1 && this.pos[1]>roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("n")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y-1][currentRoom.x];
      currentRoom.enable();
      console.log("moving on up");
      this.pos[1]=-(roomEdge);
    }
    //West
//    if(this.roomx==0 && this.roomy==2 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("w")!=-1)){
	if(this.pos[1]>-1 && this.pos[1]<1 && this.pos[0]<-roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("w")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y][currentRoom.x-1];
      currentRoom.enable();
      console.log("moving west");
      this.pos[0]=(roomEdge);
    }
    
    //east
//    if(this.roomx==4 && this.roomy==2 && keyboard.enter && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("e")!=-1)){
	if(this.pos[1]>-1 && this.pos[1]<1 && this.pos[0]>roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("e")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y][currentRoom.x+1];
      currentRoom.enable();
      console.log("moving east");
      this.pos[0]=-(roomEdge);
    }
    

    this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
    this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
  }
  
  var fade = 0;
  
	this.takeDamage = function(enemy){
		if(this.damageCounter == 0){
			this.damageCounter = 30;
			this.sanity -= enemy.damage;
			sounds[enemy.soundIndex].play();
		}
	}
  this.draw = function(){
    fade += .06;

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 155, 155);

    var offsetx = currentRoom.x - 2;
    var offsety = currentRoom.y - 2;
    for(var y = 0; y<5; y++){
      for(var x = 0; x<5; x++){
    	var someRoom = level.dungeon[offsety+y][offsetx+x];
    	if(someRoom == null || someRoom.visited == false){
    	  ctx.drawImage(emptyImg,x*30,y*30);
    	}
    	else{
    	  ctx.drawImage(roomImg,x*30,y*30);
    	  ctx.fillStyle =  "rgba(0, 0, 0, 1)";
    	  if(someRoom.type.indexOf("n")!=-1){ctx.fillRect (x*30+13, y*30, 4, 4);}
    	  if(someRoom.type.indexOf("s")!=-1){ctx.fillRect (x*30+13, y*30+28, 4, 2);}
    	  if(someRoom.type.indexOf("e")!=-1){ctx.fillRect (x*30+28, y*30+13, 2, 4);}
	  if(someRoom.type.indexOf("w")!=-1){ctx.fillRect (x*30, y*30+13, 2, 4);}
	  if(someRoom.x == currentRoom.x && someRoom.y == currentRoom.y){
	    ctx.fillStyle =  "rgba(255, 255, 255, "+(((Math.sin(fade)+1)/2)*.3 + .3) +")";
	    ctx.fillRect (x*30+3, y*30+3, 24, 24);
	  }
    	}
      }
    }

    var sanityPos = display.width - 230;
   
    ctx.fillStyle = "#808080";
    ctx.fillRect(sanityPos - 5, 35, 210, 30);

    ctx.fillStyle = "#000000";
    ctx.fillRect(sanityPos, 40, 200, 20);

    ctx.fillStyle = "#008000";
    ctx.fillRect(sanityPos, 40, 2*this.sanity, 20);

    ctx.font = "20pt sans-serif";    
    ctx.fillText("Sanity", sanityPos + 60, 25);

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
