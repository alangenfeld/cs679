function Player(pos, dim, planeSize){

  this.pos = pos;
  this.roll = 0;
  this.pitch = 90;

  this.maxSanity = 100;
  this.sanity = 100;
  this.sanityRegen = .01;
  this.damageCounter = 0;
  this.hasKey = false;
  this.defaultLightColor = [.8, .6, .5]; 
  this.specialLightColor = [.2, .2, .9]; 
  this.specialLightOn = false;

  this.hud = new HUD();

  loadModel(this, "simplePlayer");

  this.shaderName = "player";

  // somebody should change this probably
  this.color3d = [.2, .2, .8];

  this.shadow = false;
  this.init3d();  

  this.lastPress = 0;
  this.light = new Light(pos);

  this.light.col = this.defaultLightColor;
  this.lightOffset = 0.5;

  var planeSize = planeSize;
  var roomSize = 5;
  this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
  this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
  this.enterCool = 0;

  var lastRoom = null;

  this.update = function(){	
    //Decrement the damage counter so we can take damage again.
    if(this.damageCounter > 0){
      this.damageCounter--;
    }

	if(currentRoom.exitRoom && currentRoom != lastRoom){
		splashImage = puzzleSplash;
		showFlash = true;
	}
	
	lastRoom = currentRoom;

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

    if (this.hasKey && keyboard.space) {
      this.light.col = this.specialLightColor;
      this.specialLightOn = true;
      this.sanity = this.sanity -= this.sanityRegen * 5;
    } else {
      this.light.col = this.defaultLightColor;
      this.specialLightOn = false;
    }
    
    if(keyboard.space) {
    	showFlash = false;
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

    //am I at the edge? if so...
    //south
    //currentRoom.
    
    roomEdge -= .25;
    
    if(this.pos[0]>-1 && this.pos[0]<1 && this.pos[1]<-roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("s")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y+1][currentRoom.x];
      currentRoom.enable();
      this.pos[1]=(roomEdge);
    }
    
    //north
    if(this.pos[0]>-1 && this.pos[0]<1 && this.pos[1]>roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("n")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y-1][currentRoom.x];
      currentRoom.enable();
      this.pos[1]=-(roomEdge);
    }
    //West
    if(this.pos[1]>-1 && this.pos[1]<1 && this.pos[0]<-roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("w")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y][currentRoom.x-1];
      currentRoom.enable();
      this.pos[0]=(roomEdge);
    }
    
    //east
    if(this.pos[1]>-1 && this.pos[1]<1 && this.pos[0]>roomEdge && game.tick-this.enterCool>cooldown && (currentRoom.type.indexOf("e")!=-1)){
      this.enterCool = game.tick;
      currentRoom.disable();
      currentRoom = level.dungeon[currentRoom.y][currentRoom.x+1];
      currentRoom.enable();
      this.pos[0]=-(roomEdge);
    } 
    
    this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
    this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
    
    if(currentRoom.exitRoom && this.roomy == 2 && this.roomx ==2 && this.specialLightOn){
    	win();
    }
    
    if(currentRoom.box != null && 
    	this.roomy == Math.round(currentRoom.box.pos[0]/(planeSize/roomSize)+2)
    	&& this.roomx == Math.round(currentRoom.box.pos[1]/(planeSize/roomSize)+2)){
    	//console.log("Regen sanity");
    	this.sanity += this.sanityRegen*20;
    }
    
    if(currentRoom == keyRoom && !player.hasKey){
    	if(this.roomx == Math.round(currentRoom.key.pos[0]/(planeSize/roomSize)+2)&&
    		this.roomy == Math.round(currentRoom.key.pos[1]/(planeSize/roomSize)+2)){
    		player.hasKey = true;
    		splashImage = lanternSplash;
			showFlash = true;
    	}
    }
    
    if(this.sanity>this.maxSanity){
    	this.sanity = this.maxSanity;
    }
    
  };
  
  this.takeDamage = function(enemy){
    if(this.damageCounter == 0){
      this.damageCounter = 30;
      this.sanity -= enemy.damage;
      
      if(hasSounds){
		sounds[enemy.soundIndex].play();
      }
    }
  };

  this.draw = function(){
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
