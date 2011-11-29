function Light(pos) {
  this.pos = pos;
  this.col = [1.0, 0.9, 0.9];
  this.turnedOn = true;
  this.manualControl = false;
  this.ambient = [0.01, 0.01, 0.01];
  this.bright = [0.8, 0.06, 0.05];
  this.dim = [1.0, 1.0, 1.0];
  this.attenuation = this.bright;
  this.transformedPos = [0,0,0];
  this.lastPress = 0;
  this.yaw = 0.0;
  this.pitch = 0.0;

  this.init();

  //  this.box = new Box(this.pos, [.2, .2, .2]);

  this.update = function() {
    
    if (this.manualControl) {
      var speed = 0.2;
      if(keyboard.left) {
	this.pos[0] -= speed;
      } else if(keyboard.right) {
	this.pos[0] += speed;
      }else if(keyboard.up && keyboard.z) {
	this.pos[2] += speed;
      } else if(keyboard.down && keyboard.z) {
	this.pos[2] -= speed;
      } else if(keyboard.up) {
	this.pos[1] += speed;
      } else if(keyboard.down) {
	this.pos[1] -= speed;
      }
      var cooldown = 10;

      // use to compare light settings using spacebar. 
      if (keyboard.space && game.tick - this.lastPress > cooldown) {
	if (this.turnedOn) {

	} else {

	}
	this.lastPress = game.tick;
      }
    }      
  };

  this.set = function(face) {
    switch(face) {
    case 0 : // +x
      this.pitch = 90;
      this.yaw = -90;
      break;
    case 1 : // -x
      this.pitch = 90;
      this.yaw = 90;
      break;
    case 2 : //+y
      this.pitch = 90;
      this.yaw = 0;
      break;
    case 3 : //-y
      this.pitch = 90;
      this.yaw = 180;
      break;
    case 4 : //+z
      this.pitch = 180;
      this.yaw = 0;
      break;
    case 5 : //-z
      this.pitch = 0;
      this.yaw = 90;
      break;
    }

    mat4.identity(vMatrix);

    mat4.rotate(vMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.rotate(vMatrix, degToRad(-this.pitch), [1, 0, 0]);
    var temp = vec3.create();
    vec3.scale(this.pos, -1, temp);
    mat4.translate(vMatrix, temp);
  };
}
Light.prototype = new GameObject;
