function Enemy(pos, dim,ai) {
  this.pos = pos;
  this.originalPos = pos;

  this.roll = 0;
  this.pitch = -90;

  this.damage = 1.0;
  
  this.enabled = false;
  
  this.aiVars = new Array();
  this.ai = ai;
  // use to compare light settings using spacebar. 

  loadModel(this, "ShadowEnemy1");
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
	if(this.enabled){
		this.ai();
	}
  };
  
}
Enemy.prototype = new GameObject3D;

//Random movement.
var ai0 = function(){
	this.damage = 2.0 / 60.0;

	if(this.aiVars['count'] === undefined){
		this.aiVars['count'] = 0;
	}
	var moveDist = 0.05;
	var moveCount = 30;
	
	if(this.aiVars['count'] === 0){
		this.direction = Math.floor(Math.random() * 4);
	}
	//North
	if(this.direction === 0){
		this.pos[1] -= moveDist;
	}
	//East
	if(this.direction === 1){
		this.pos[0] += moveDist;
	}
	//South
	if(this.direction === 2){
		this.pos[1] += moveDist;
	}
	//West
	if(this.direction === 3){
		this.pos[0] -= moveDist;
	}
	this.aiVars['count']++;
	this.aiVars['count'] %= moveCount;
}

//Fly tword player.
var ai1 = function(){
	this.damage = 3.0 / 60.0;
	var delay = 10;
	var delay2 = 10;
	var delayRand = (Math.random() * 20);
	var accel = 0.013;
	var accelDir = 0.01;
	if(this.aiVars['count'] === undefined){
		this.aiVars['count'] = delay;
		this.aiVars['count2'] = delay2 + delayRand;
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
		//console.log(this.aiVars['travelDir']);
		this.pos[1] += this.aiVars['travelDir'][1] * this.aiVars['accel'];
		this.pos[0] += this.aiVars['accelDir'];
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
		this.aiVars['accel'] += accel;
	}
}
