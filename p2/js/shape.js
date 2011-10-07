function Shape() {

  var vertexBuffer = gl.CreateBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var vertices = [
    0.0,  1.0,  0.0,
    -1.0, -1.0,  0.0,
    1.0, -1.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  this.init();

  this.update = function() {
    
  };

  this.draw = function() {


  };
}
Shape.prototype = new GameObject;
