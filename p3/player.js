function Player(pos, dim, planeSize){
		this.pos = pos;
  		// use an inverted box to have light from inside light box
  		this.Box = new InvertedBox(pos, dim, [1,1,1]);
  		// turn shadows off to prevent player hull from blocking lights view of room
  		this.Box.shadow = false;

		this.transformedPos = [0,0,0];
		this.lastPress = 0;
		this.light = new Light(pos);
		var planeSize = planeSize;
		var roomSize = 5;
		this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
    	this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
    	this.enterCool = 0;

		this.update = function(){	
    		var speed = 0.2;
    		var roomEdge = planeSize/2 -.25;
    		//instead of making it continuous... make it snap?
    		//console.log("pos ="+this.pos[0]+" planelim =" +-planeSize/2);
    		if(keyboard.left && this.pos[0]>-roomEdge) {
    		  this.pos[0] -= speed;
    		  //console.log("pos ="+this.pos[0]+" planelim =" +-planeSize/2);
    		} else if(keyboard.right && this.pos[0]<roomEdge) {
    		  this.pos[0] += speed;
    		} else if(keyboard.up && this.pos[1]<roomEdge) {
    		  this.pos[1] += speed;
    		} else if(keyboard.down && this.pos[1]>-roomEdge) {
    		  this.pos[1] -= speed;
    		}
    		var cooldown = 10;
    		this.light.pos = this.pos;

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
    		
    		
    		this.light.pos = this.pos;
    		mat4.multiplyVec3(mMatrix, this.pos, this.transformedPos);
    		mat4.multiplyVec3(mMatrix, this.light.pos, this.light.transformedPos);
    		this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
    		this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);
    		
  		}
  		
  		this.draw = function(){
  			ctx.drawImage(roomImg,0,0,150,150);
    		if(currentRoom.type.indexOf("n")!=-1){ctx.drawImage(emptyImg, 150/2, 0);}
    		if(currentRoom.type.indexOf("s")!=-1){ctx.drawImage(emptyImg, 150/2, 120);}
    		if(currentRoom.type.indexOf("e")!=-1){ctx.drawImage(emptyImg, 120, 150/2);}
    		if(currentRoom.type.indexOf("w")!=-1){ctx.drawImage(emptyImg, 0, 150/2);}
  		}
  		
		this.init();
  		
	}

  		Player.prototype = new GameObject;