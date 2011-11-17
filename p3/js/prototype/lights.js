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

  this.yaw = 0.0;
  this.pitch = 0.0;

  this.init();

//  this.box = new Box(this.pos, [.2, .2, .2]);

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

    // use to compare light settings using spacebar. 
    if (keyboard.space && game.tick - this.lastPress > cooldown) {
      if (this.turnedOn) {
//	this.attenuation = this.dim;
//	this.turnedOn = false;
      } else {
//	this.attenuation = this.bright;
//	this.turnedOn = true;
      }
      this.lastPress = game.tick;
    }
      
    mat4.multiplyVec3(mMatrix, this.pos, this.transformedPos);
  };

  this.set = function() {
    mat4.rotate(lMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.rotate(lMatrix, degToRad(-this.pitch), [1, 0, 0]);
    var temp = vec3.create();
    vec3.scale(this.pos, -1, temp);
    mat4.translate(lMatrix, temp);
  };
}
Light.prototype = new GameObject;
