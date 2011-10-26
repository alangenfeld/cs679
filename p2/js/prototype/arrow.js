function Arrow(x, y, ort) {
  this.posX = x;
  this.posY = y;
  this.orientation = ort;
  this.colorV = [0.0, 1.0, 0.0];

  this.shader = getShader("shape");
  setAttribute(this, 
	       {name: "vtx",
		content: [
		  -1.0, 0.0, 0.2,
		  0.0, 1.0, 0.2,
		  1.0, 0.0, 0.2,
		  
		  0.2, 0.0, 0.2,
		  -0.2, 0.0, 0.2,
		  -0.2, -1.0, 0.2,

		  -0.2, -1.0, 0.2,
		  0.2, -1.0, 0.2,
		  0.2, 0.0, 0.2
		]});
  this.attributes = ["vtx"];
  this.attributes.size = 9;
  this.shader.color = gl.getUniformLocation(this.shader, "color");

  this.init();

  this.draw = function() {
    this.draw2d();
    this.draw3d();
  };

  this.draw2d = function() {
    var cellSize = board.cellSize;
    c = board.getCenterCoordinates( this.posX, this.posY );
    
    ctx.strokeStyle = "#00EE00";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    var u = {x:0,y:0};
    var v0 = {x:0,y:0};
    var v1 = {x:0,y:0};
    u.y = -cellSize * 0.45;
    u.x = 0;
    v0 = board.align( u, this.orientation );
    v0.x += c.x;
    v0.y += c.y;
    
    
    u.x = - cellSize * 0.3;
    u.y = 0;
    v1 = board.align( u, this.orientation );
    v1.x += c.x;
    v1.y += c.y;
    ctx.moveTo( v0.x, v0.y );
    ctx.lineTo( v1.x, v1.y );
    
    u.x = cellSize * 0.3;
    u.y = 0;
    v1 = board.align( u, this.orientation );
    v1.x += c.x;
    v1.y += c.y;
    ctx.moveTo( v0.x, v0.y );
    ctx.lineTo( v1.x, v1.y );
    
    
    u.y = cellSize * 0.45;
    u.x = 0;
    v1 = board.align( u, this.orientation );
    v1.x += c.x;
    v1.y += c.y;
    ctx.moveTo( v0.x, v0.y );
    ctx.lineTo( v1.x, v1.y );
    
    ctx.closePath();
    ctx.stroke();
  };

  this.draw3d = function() {
    mvPushMatrix();
    
    mat4.translate(mvMatrix, [this.posX/2.0, this.posY/2.0, 0.0]);
    mat4.scale(mvMatrix, [0.25, 0.25, 0.25]);
    mat4.translate(mvMatrix, [1.0, 1.0, 0.0]);
    var rot = 0;
    switch(this.orientation) {
    case 0:
      rot = 180;
      break;
    case 1:
      rot = 90;
      break;
    case 2:
      rot = -90;
      break;
    case 3:
      rot = 0;
      break;
    }
    mat4.rotate(mvMatrix, degToRad(rot), [0,0,1]); 
    gl.useProgram(this.shader);
    
    gl.uniform3fv(this.shader.color, this.colorV);
    bindAttributes(this);
    
    setMatrixUniforms(this.shader);
    
    gl.drawArrays(gl.TRIANGLES, 0, this.attributes.size);
    mvPopMatrix();
  };
}
Arrow.prototype = new GameObject;
