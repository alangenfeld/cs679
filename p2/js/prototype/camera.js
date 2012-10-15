function Camera() {
  this.loc = vec3.create([-3.0, -7.0, -5.25]);

  gl.viewport(0, 0, display.width, display.height);

  mat4.perspective(45, display.width / display.height, 0.1, 100.0, pMatrix);

  this.init();
  this.yaw = 0.0;
  this.pitch = 327.0;
  this.speed = 0.05;
  this.roll = 0.3;
  this.mouseX = 0;
  this.mouseY = 0;
  this.leftPressed = false;
  this.rightPressed = false;

  this.update = function() {
    mat4.identity(mvMatrix);
    
    if (mouse.leftPressed && this.leftPressed && keyboard.z) {
      this.loc[2] -= (mouse.y - this.mouseY)*this.speed;
    } else if (mouse.leftPressed && this.leftPressed) {
      this.loc[0] += (mouse.x - this.mouseX)*this.speed;
      this.loc[1] += (mouse.y - this.mouseY)*this.speed;
    } else if (mouse.rightPressed && this.rightPressed) {
      this.yaw -= (mouse.x - this.mouseX)*this.roll;
      this.pitch += (mouse.y - this.mouseY)*this.roll;
    } else {
      this.leftPressed = mouse.leftPressed;
      this.rightPressed = mouse.rightPressed;
    }
    this.mouseX = mouse.x;
    this.mouseY = mouse.y;
    
    mat4.scale(mvMatrix, [1.0, -1.0, 1.0]);
    mat4.rotate(mvMatrix, degToRad(-this.pitch), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.translate(mvMatrix, this.loc);
  };
}
Camera.prototype = new GameObject;
