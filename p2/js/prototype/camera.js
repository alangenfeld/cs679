function Camera() {
  this.loc = vec3.create([-3.0, 5.0, -10.0]);

  gl.viewport(0, 0, display.width, display.height);
  this.init();
  this.yaw = 0.0;
  this.pitch = 30.0;

  this.update = function() {
    mat4.perspective(45, display.width / display.height, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    
    mat4.rotate(mvMatrix, degToRad(-this.pitch), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.translate(mvMatrix, this.loc);
  };
}
Camera.prototype = new GameObject;
