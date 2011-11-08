function Camera() {
  this.loc = vec3.create([0, -10, 15]);

  gl.viewport(0, 0, display.width, display.height);

  mat4.perspective(45, display.width / display.height, 0.1, 100.0, pMatrix);

  this.init();
  this.yaw = 0.0;
  this.pitch = 40.0;
  this.speed = 0.05;
  this.roll = 0.3;
  this.mouseX = 0;
  this.mouseY = 0;
  this.leftPressed = false;
  this.rightPressed = false;

  // will change
  this.update = function() {
    mat4.identity(mvMatrix);
    
    if (mouse.leftPressed && this.leftPressed && keyboard.z) {
      this.loc[2] -= (mouse.y - this.mouseY)*this.speed;
    } else if (mouse.leftPressed && this.leftPressed) {
      this.loc[0] -= (mouse.x - this.mouseX)*this.speed;
      this.loc[1] += (mouse.y - this.mouseY)*this.speed;
    } else if (mouse.rightPressed && this.rightPressed) {
      this.yaw -= (mouse.x - this.mouseX)*this.roll;
      this.pitch -= (mouse.y - this.mouseY)*this.roll;
    } else {
      this.leftPressed = mouse.leftPressed;
      this.rightPressed = mouse.rightPressed;
    }
    this.mouseX = mouse.x;
    this.mouseY = mouse.y;
    
    mat4.rotate(mvMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(-this.pitch), [1, 0, 0]);
    var temp = vec3.create();
    vec3.scale(this.loc, -1, temp);
    mat4.translate(mvMatrix, temp);
  };
}
Camera.prototype = new GameObject;

function Light(pos) {
  this.pos = pos;
  this.col = [1.0, 0.9, 0.9];
  this.ambient = [0.1, 0.1, 0.1];
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
      this.col = this.col[0] > 0 ? [0,0,0] : [1,1,1];
      this.lastPress = game.tick;
    }
      

    mat4.multiplyVec3(mvMatrix, this.pos, this.transformedPos);
  };
}
Light.prototype = new GameObject;

