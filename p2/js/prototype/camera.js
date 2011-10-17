function Camera() {
  this.loc = vec3.create([0.0, 0.0, -20.0]);

  gl.viewport(0, 0, display.width, display.height);
  this.init();

  this.update = function() {
    mat4.perspective(45, display.width / display.height, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, this.loc);
  };
}
Camera.prototype = new GameObject;
