function Camera() {
  this.loc = vec3.create([0.0, 0.0, -50.0]);

  gl.viewport(0, 0, display.width, display.height);
  this.init();

  this.update = function() {
    mat4.perspective(45, display.width / display.height, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    if (keyboard.down) {
      this.loc[2] -= 0.2;
    } else if (keyboard.up) {
      this.loc[2] += 0.2;
    } else if (keyboard.left) {
      this.loc[0] -= 0.2;
    } else if (keyboard.right) {
      this.loc[0] += 0.2;
    }

    mat4.translate(mvMatrix, this.loc);
  };
}
Camera.prototype = new GameObject;
