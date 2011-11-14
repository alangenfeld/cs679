function Light(pos) {
  this.pos = pos;
  this.col = [1.0, 0.9, 0.9];
  this.turnedOn = true;
  this.ambient = [0.01, 0.01, 0.01];
  this.bright = [0.8, 0.06, 0.05];
  this.dim = [1.0, 0.22, 0.2];
  this.attenuation = this.bright;
  this.transformedPos = [0,0,0];
  this.lastPress = 0;
  this.init();

  this.update = function() {
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
    if (keyboard.space && game.tick - this.lastPress > cooldown) {
      if (this.turnedOn) {
	this.attenuation = this.dim;
	this.turnedOn = false;
      } else {
	this.attenuation = this.bright;
	this.turnedOn = true;
      }

      this.lastPress = game.tick;
    }
      

    mat4.multiplyVec3(mvMatrix, this.pos, this.transformedPos);
  };
}
Light.prototype = new GameObject;