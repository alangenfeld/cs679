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

		this.update = function(){	
    		var speed = 0.2;
    		//instead of making it continuous... make it snap?
    		//console.log("pos ="+this.pos[0]+" planelim =" +-planeSize/2);
    		if(keyboard.left && this.pos[0]>-planeSize/2) {
    		  this.pos[0] -= speed;
//    		  console.log("pos ="+this.pos[0]+" planelim =" +-planeSize/2);
    		} else if(keyboard.right && this.pos[0]<planeSize/2) {
    		  this.pos[0] += speed;
    		} else if(keyboard.up && this.pos[1]<planeSize/2) {
    		  this.pos[1] += speed;
    		} else if(keyboard.down && this.pos[1]>-planeSize/2) {
    		  this.pos[1] -= speed;
    		}
    		var cooldown = 10;
    		this.light.pos = this.pos;

    		// use to compare light settings using spacebar. 
    		if (keyboard.space && game.tick - player.lastPress > cooldown) {
      			player.lastPress = game.tick;
    		}
      
    		mat4.multiplyVec3(mMatrix, this.pos, this.transformedPos);
    		mat4.multiplyVec3(mMatrix, this.light.pos, this.light.transformedPos);
    		this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);;
    		this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);;
  		}
  		
	}
