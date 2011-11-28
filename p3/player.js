function Player(pos, dim){
		this.pos = pos;
		this.Box = new Box(pos, dim);
		this.transformedPos = [0,0,0];
		this.lastPress = 0;
		this.light = new Light(pos);
		var planeSize = 15;
		var roomSize = 5;
		this.roomx = Math.round(this.pos[0]/(planeSize/roomSize)+2);
    	this.roomy = Math.round(this.pos[1]/(planeSize/roomSize)+2);

		this.update = function(){	
    		var speed = 0.2;
    		//instead of making it continuous... make it snap?
    		if(keyboard.left) {
    		  this.pos[0] -= speed;
    		} else if(keyboard.right) {
    		  this.pos[0] += speed;
    		} else if(keyboard.up) {
    		  this.pos[1] += speed;
    		} else if(keyboard.down) {
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