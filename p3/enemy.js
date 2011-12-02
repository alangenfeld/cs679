function Enemy(pos, dim, p){
	this.pos = pos;
	this.originalPos = pos;
	this.Box = new Box(pos, dim);
	this.player = p;
	this.transformedPos = [0,0,0];
	this.aiVars = new Array();
	this.ai = ai1;
	// use to compare light settings using spacebar. 
    if (keyboard.space && game.tick - player.lastPress > cooldown) {
    	player.lastPress = game.tick;
    }
	this.toggled = false;
	this.update = function(){
		this.ai();
		mat4.multiplyVec3(mMatrix, this.pos, this.transformedPos);
	}
	
}

//Random movement.
var ai0 = function(){
	if(this.aiVars['count'] === undefined){
		this.aiVars['count'] = 0;
	}
	var moveDist = 0.05;
	var moveCount = 20;
	
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
	var delay = 200;
	var accel = 0.013;
	var accelDir = 0.01;
	console.log(this.aiVars['count']);
	if(this.aiVars['count'] === undefined){
		this.aiVars['count'] = delay;
	}
	if(this.aiVars['count'] > 0){
		this.aiVars['count']--;
		console.log("yay");
		return;
	}
	
	if(this.aiVars['travelDir'] === undefined){
		this.aiVars['accel'] = 0.0;
		this.aiVars['accelDir'] = 0.0;
		var tempX = this.pos[0] - this.player.pos[0];
		var tempY = this.pos[1] - this.player.pos[1];
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
		console.log("y");
		if(this.pos[0] - this.player.pos[0] > 0){
			this.aiVars['accelDir'] -= accelDir;
		}
		if(this.pos[0] - this.player.pos[0] < 0){
			this.aiVars['accelDir'] += accelDir;
		}
		//console.log(this.aiVars['travelDir']);
		this.pos[1] += this.aiVars['travelDir'][1] * this.aiVars['accel'];
		this.pos[0] += this.aiVars['accelDir'];
		this.aiVars['accel'] += accel;
	}
	else{
		console.log("x");
		if(this.pos[1] - this.player.pos[1] > 0){
			this.aiVars['accelDir'] -= accelDir;
		}
		if(this.pos[1] - this.player.pos[1] < 0){
			this.aiVars['accelDir'] += accelDir;
		}
		this.pos[0] += this.aiVars['travelDir'][0] * this.aiVars['accel'];
		this.pos[1] += this.aiVars['accelDir'];
		this.aiVars['accel'] += accel;
	}
}