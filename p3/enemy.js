function Enemy(pos, dim, ai, parent) {
	this.pos = pos;
	this.originalPos = pos;
	this.parent = parent;
	
	this.roll = 0;
	this.pitch = -90;

	this.xMin = -4.5;
	this.xMax = 4.5;
	
	this.yMin = -5.0;
	this.yMax = 3.5;
	
	this.damage = 10;
  
	this.enabled = false;
  
	this.soundIndex = "aiBloodSplat";
  
	this.aiVars = new Array();
	this.ai = ai;
	// use to compare light settings using spacebar. 

	loadModel(this, "ShadowEnemy1");
	this.color3d = [.5, 0, .5];
	if (shadows) {
		this.shaderName = "color_shadow";
	} else {
		this.shaderName = "color";
	}
	this.init3d();

	this.draw = function() {
		mPushMatrix();

		mat4.translate(mMatrix, this.pos);
		mat4.rotate(mMatrix, degToRad(this.roll), [0, 0, 1]);
		mat4.rotate(mMatrix, degToRad(this.pitch), [1, 0, 0]);

		this.draw3d();
		mPopMatrix();
	};

	//x - the number of blocks you want to move left or right.  left being negative right being positive.
	//y - the number of blocks you want to move up or down.  Up being negative, down being positive. 
	this.move = function(x, y){
		this.pos[0] += x;
		this.pos[1] += y;
	}
	
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
		this.aiVars['xDir'] = 0;
		this.aiVars['yDir'] = 0;
		this.aiVars['count'] = 0;
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
	
	if(this.pos[0] + (moveDist * this.aiVars['xDir']) < this.xMin ||
		this.pos[0] + (moveDist * this.aiVars['xDir']) > this.xMax)
	{
		this.aiVars['xDir'] *= -1; 
	}
	if(this.pos[1] + (moveDist * this.aiVars['yDir']) < this.yMin ||
		this.pos[1] + (moveDist * this.aiVars['yDir']) > this.yMax)
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
	this.damage = 3.0;
	var delay = 10;
	var delay2 = 10;
	var delayRand = (Math.random() * 20);
	var accel = 0.008;
	var accelDir = 0.003;
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


var ai2 = function(){
	if(this.aiVars['xDir'] === undefined){
		this.aiVars['xDir'] = 0;
		this.aiVars['yDir'] = 1.0;
		this.aiVars['count'] = 1;
	}
	
	this.aiVars['count']--;
	if(this.aiVars['count'] <= 0){
		if(Math.random() < 0.6){
			this.aiVars['yDir'] *= -1;
		}
		this.aiVars['count'] = 40;
	}
	
	var movedist = 0.07;
	if(this.pos[0] + (movedist * this.aiVars['xDir']) < this.xMin ||
		this.pos[0] + (movedist * this.aiVars['xDir']) > this.xMax)
	{
		this.aiVars['xDir'] *= -1; 
	}
	if(this.pos[1] + (movedist * this.aiVars['yDir']) < this.yMin ||
		this.pos[1] + (movedist * this.aiVars['yDir']) > this.yMax)
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
	if(this.aiVars['xDir'] === undefined){
		this.aiVars['xDir'] = (Math.random() * 2.0) - 1.0;
		this.aiVars['yDir'] = (Math.random() * 2.0) - 1.0;
	
	}
	
	var movedist = 0.06;
	if(this.pos[0] + (movedist * this.aiVars['xDir']) < this.xMin ||
		this.pos[0] + (movedist * this.aiVars['xDir']) > this.xMax)
	{
		this.aiVars['xDir'] *= -1; 
	}
	if(this.pos[1] + (movedist * this.aiVars['yDir']) < this.yMin ||
		this.pos[1] + (movedist * this.aiVars['yDir']) > this.yMax)
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

//Follow the player.
var ai4 = function(){}