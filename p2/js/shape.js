function Shape() {
  this.vtxBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vtxBuffer);
  var vertices = [
    0.0,  1.0,  0.0,
    -1.0, -1.0,  0.0,
    1.0, -1.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  this.shader = getShader("white");
  this.init();

  this.update = function() {
  };

  this.draw = function() {
    gl.useProgram(this.shader);
    this.shader.vtxPos = gl.getAttribLocation(this.shader, "aVertexPosition");
    gl.enableVertexAttribArray(this.shader.vtxPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vtxBuffer);
    gl.vertexAttribPointer(this.shader.vtxPos,
			   3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
}
Shape.prototype = new GameObject;
