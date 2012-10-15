function Camera() {
  this.pos = vec3.create([0, 0, 0]);

  this.init();
  this.yaw = 0.0;
  this.pitch = 40.0;
  this.speed = 0.05;
  this.roll = 0.2;
  this.mouseX = 0;
  this.mouseY = 0;
  this.leftPressed = false;
  this.rightPressed = false;

  // will change
  this.update = function() {
    if (mouse.leftPressed && this.leftPressed && keyboard.z) {
      this.pos[2] -= (mouse.y - this.mouseY)*this.speed;
    } else if (mouse.leftPressed && this.leftPressed) {
      this.pos[0] -= (mouse.x - this.mouseX)*this.speed;
      this.pos[1] += (mouse.y - this.mouseY)*this.speed;
    } else if (mouse.rightPressed && this.rightPressed) {
      this.yaw -= (mouse.x - this.mouseX)*this.roll;
      this.pitch -= (mouse.y - this.mouseY)*this.roll;
    } else {
      this.leftPressed = mouse.leftPressed;
      this.rightPressed = mouse.rightPressed;
    }
    this.mouseX = mouse.x;
    this.mouseY = mouse.y;
  };

  this.set = function() {
    mat4.perspective(45, display.width / display.height, 0.1, 100.0, pMatrix);
    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    mat4.rotate(vMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.rotate(vMatrix, degToRad(-this.pitch), [1, 0, 0]);
    var temp = vec3.create();
    vec3.scale(this.pos, -1, temp);
    mat4.translate(vMatrix, temp);
  };
}
Camera.prototype = new GameObject;

var camera = new Camera();


