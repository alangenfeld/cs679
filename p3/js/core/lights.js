function Light(pos, box) {
  this.pos = pos;
  this.col = [1.0, 0.9, 0.9];
  this.turnedOn = true;
  this.manualControl = false;
  this.ambient = [0.10, 0.10, 0.10];
  this.bright = [0.8, 0.06, 0.05];
  this.dim = [1.0, 1.0, 1.0];
  this.attenuation = this.bright;
  this.transformedPos = [0,0,0];
  this.lastPress = 0;
  this.yaw = 0.0;
  this.pitch = 0.0;

  this.init();

  if (box) {
    this.box = new InvertedBox(this.pos, [.5, .5, .5], [1,1,1]);
    this.box.shadow = false;
  }

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
    mat4.identity(vMatrix);
    switch(face) {
    case 0 : // +x
      mat4.lookAt(this.pos, [100, 0, 0], [0, -1, 0], vMatrix);
      break;
    case 1 : // -x
      mat4.lookAt(this.pos, [-100, 0, 0], [0, -1, 0], vMatrix);
      break;
    case 2 : //+y
      mat4.lookAt(this.pos, [0, 100, 0], [0, 0, 1], vMatrix);
      break;
    case 3 : //-y
      mat4.lookAt(this.pos, [0, -100, 0], [0, 0, -1], vMatrix);
      break;
    case 4 : //+z
      mat4.lookAt(this.pos, [0, 0, 100], [0, -1, 0], vMatrix);
      break;
    case 5 : //-z
      mat4.lookAt(this.pos, [0, 0, -100], [0, -1, 0], vMatrix);
      break;
    }

  };
}
Light.prototype = new GameObject;
