function Enemy(pos, dim, ai) {
  this.planeSize = 15;
  this.roomEdge = this.planeSize/2 -.25;
  this.pos = pos;
  this.originalPos = pos;
  this.roll = 0;
  this.pitch = 90;

  this.damage = 10.0;
  
  this.enabled = false;
  this.model = "ShadowEnemy1";
  this.soundIndex = "aiBloodSplat";
	this.aiVars = {init:true};
  this.ai = ai;
  this.ai();
  // use to compare light settings using spacebar. 

  loadModel(this, this.model);
  this.color3d = [.5, 0, .5];
  this.shaderName = "enemy";

  this.init3d();

  this.draw = function() {
		mPushMatrix();

		mat4.translate(mMatrix, this.pos);
		mat4.rotate(mMatrix, degToRad(this.roll), [0, 0, 1]);
		mat4.rotate(mMatrix, degToRad(this.pitch), [1, 0, 0]);

		this.draw3d();
		mPopMatrix();
  };

  this.update = function(){
  
    if(this.enabled&&!showFlash&&!player.specialLightOn){
      this.render = true;
      this.shadow = true;
      this.ai();
    }
    else{
      this.render = false;
    }
  };
  
}
Enemy.prototype = new GameObject3D;

//Random movement.
var ai0 = function(){
	this.damage = 20.0;

	if(this.aiVars['init']){
		this.aiVars['init'] = false;
		this.aiVars['xDir'] = 0;
		this.aiVars['yDir'] = 0;
		this.aiVars['count'] = 0;
		this.aiVars['fireCount'] = 0;
		this.model = "ShadowEnemy1";
		return;
	}
	var moveDist = 0.05;
	var moveCount = 30;
	
	if(this.aiVars['count'] === 0){
		this.direction = Math.floor(Math.random() * 4);
		if(this.direction == 0){
			this.aiVars['xDir'] = 0;
			this.aiVars['yDir'] = 1;
		}
		if(this.direction == 1){
			this.aiVars['xDir'] = 0;
			this.aiVars['yDir'] = -1;
		}
		if(this.direction == 2){
			this.aiVars['xDir'] = 1;
			this.aiVars['yDir'] = 0;
		}
		if(this.direction == 3){
			this.aiVars['xDir'] = -1;
			this.aiVars['yDir'] = 0;
		}
	}
	
	
	if(this.pos[0] + (moveDist * this.aiVars['xDir']) < -this.roomEdge ||
		this.pos[0] + (moveDist * this.aiVars['xDir']) > this.roomEdge)
	{
		this.aiVars['xDir'] *= -1; 
	}
	
	if(this.pos[1] + (moveDist * this.aiVars['yDir']) < -this.roomEdge ||
		this.pos[1] + (moveDist * this.aiVars['yDir']) > this.roomEdge)
	{
		this.aiVars['yDir'] *= -1;
	}
	
	this.pos[0] += this.aiVars['xDir'] * moveDist;
	this.pos[1] += this.aiVars['yDir'] * moveDist;
	
	this.aiVars['count']++;
	this.aiVars['count'] %= moveCount;
}

//Fly tword player.
var ai1 = function(){

	this.damage = 10.0;
	var delay = 10;
	var delay2 = 10;
	var delayRand = (Math.random() * 20);
	var accel = 0.006;
	var accelDir = 0.003;
	if(this.aiVars['init']){
		this.aiVars['init'] = false;
		this.aiVars['count'] = delay;
		this.aiVars['count2'] = delay2 + delayRand;
		this.model = "pufferFish";
		return;
	}
	if(this.aiVars['count'] > 0){
		this.aiVars['count']--;
		return;
	}
	if(this.pos[2] < 1.5){
		this.pos[2] += 0.05;
		return;
	}
	if(this.aiVars['count2'] > 0){
		this.aiVars['count2']--;
		return;
	}
	
	if(this.aiVars['travelDir'] === undefined){
		this.aiVars['accel'] = 0.0;
		this.aiVars['accelDir'] = 0.0;
		var tempX = this.pos[0] - player.pos[0];
		var tempY = this.pos[1] - player.pos[1];
		if(Math.abs(tempX) > Math.abs(tempY)){
			if(tempX < 0){
				this.aiVars['travelDir'] = [1, 0, 0];
			}
			else{
				this.aiVars['travelDir'] = [-1,0,0];
			}
		}
		else{
			if(tempY < 0){
				this.aiVars['travelDir'] = [0, 1, 0];
			}
			else{
				this.aiVars['travelDir'] = [0,-1,0];
			}
		}
	}
	if(this.aiVars['travelDir'][0] === 0){
		if(this.pos[0] - player.pos[0] > 0){
			this.aiVars['accelDir'] -= accelDir;
		}
		if(this.pos[0] - player.pos[0] < 0){
			this.aiVars['accelDir'] += accelDir;
		}

		this.pos[1] += this.aiVars['travelDir'][1] * this.aiVars['accel'];
		this.pos[0] += this.aiVars['accelDir'];
		if(this.pos[0] > this.roomEdge || this.pos[0] < -this.roomEdge || this.pos[1] > this.roomEdge || this.pos[1] < -this.roomEdge){
			this.shutdown();
		}
		this.aiVars['accel'] += accel;
	}
	else{
		if(this.pos[1] - player.pos[1] > 0){
			this.aiVars['accelDir'] -= accelDir;
		}
		if(this.pos[1] - player.pos[1] < 0){
			this.aiVars['accelDir'] += accelDir;
		}
		this.pos[0] += this.aiVars['travelDir'][0] * this.aiVars['accel'];
		this.pos[1] += this.aiVars['accelDir'];
		if(this.pos[0] > this.roomEdge || this.pos[0] < -this.roomEdge || this.pos[1] > this.roomEdge || this.pos[1] < -this.roomEdge){
			this.shutdown();
		}
		this.aiVars['accel'] += accel;
	}
}


var ai2 = function(){
	
	this.damage = 15.0;
	if(this.aiVars['init']){
		this.aiVars['xDir'] = 0;
		this.aiVars['yDir'] = 1.0;
		this.aiVars['count'] = 1;
		this.aiVars['init'] = false;
		this.model = "ShadowEnemy2";
		return;
	}
	
	this.aiVars['count']--;
	if(this.aiVars['count'] <= 0){
		if(Math.random() < 0.6){
			this.aiVars['yDir'] *= -1;
		}
		this.aiVars['count'] = 40;
	}
	
	var movedist = 0.07;
	if(this.pos[0] + (movedist * this.aiVars['xDir']) < -this.roomEdge ||
		this.pos[0] + (movedist * this.aiVars['xDir']) > this.roomEdge)
	{
		
		this.aiVars['xDir'] *= -1; 
	}
	if(this.pos[1] + (movedist * this.aiVars['yDir']) < -this.roomEdge ||
		this.pos[1] + (movedist * this.aiVars['yDir']) > this.roomEdge)
	{
		this.aiVars['yDir'] *= -1;
	}
	
	//Max is 4.5
	//Min is -4.5
	this.pos[0] += movedist * this.aiVars['xDir'];
	
	//Max is 3.5
	//Min is -5
	this.pos[1] += movedist * this.aiVars['yDir'];
	
}

var ai3 = function(){	
	
	this.damage = 15.0;
	if(this.aiVars['init']){
		this.aiVars['xDir'] = (Math.random() * 2.0) - 1.0;
		this.aiVars['yDir'] = (Math.random() * 2.0) - 1.0;
		
		var normal = Math.sqrt(Math.pow(this.aiVars['xDir'], 2.0) + Math.pow(this.aiVars['yDir'], 2.0));
		this.aiVars['xDir'] = this.aiVars['xDir'] / normal;
		this.aiVars['yDir'] = this.aiVars['yDir'] / normal;
		
		
		this.aiVars['init'] = false;
		return;
	}
	
	var movedist = 0.15;
	if(this.pos[0] + (movedist * this.aiVars['xDir']) < -this.roomEdge ||
		this.pos[0] + (movedist * this.aiVars['xDir']) > this.roomEdge)
	{
		this.aiVars['xDir'] *= -1; 
	}
	if(this.pos[1] + (movedist * this.aiVars['yDir']) < -this.roomEdge ||
		this.pos[1] + (movedist * this.aiVars['yDir']) > this.roomEdge)
	{
		this.aiVars['yDir'] *= -1;
	}
	
	//Max is 4.5
	//Min is -4.5
	this.pos[0] += movedist * this.aiVars['xDir'];
	
	//Max is 3.5
	//Min is -5
	this.pos[1] += movedist * this.aiVars['yDir'];
	
}

//straight line.
var ai4 = function(){
	if(this.aiVars['init']){
		this.model = "phronima";
		this.aiVars['init'] = false;
	}
}
