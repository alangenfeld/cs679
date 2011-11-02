function TargetBox(x, y) {
  this.posX = x;
  this.posY = y;
  this.colorV = [1,0,0];

  this.shader = getShader("shape");
  setAttribute(this, 
	       {name: "vtx",
		content: [
		  -1.0, -1.0, 0.3,
		  -1.0, 1.0, 0.3,
		  1.0, 1.0, 0.3,
		  
		  1.0, 1.0, 0.3,
		  1.0, -1.0, 0.3,
		  -1.0, -1.0, 0.3
		]});
  this.attributes = ["vtx"];
  this.attributes.size = 6;
  this.shader.color = gl.getUniformLocation(this.shader, "color");

  this.init();

  this.draw = function() {
//    this.draw2d();
    this.draw3d();
  };


  this.draw2d = function() {
    var cellSize = board.cellSize;
    c = board.getCenterCoordinates( this.posX, this.posY );
    
    ctx.strokeStyle = "#AA0000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    var v0 = {x:0,y:0};
    var v1 = {x:0,y:0};
    var v2 = {x:0,y:0};
    var v3 = {x:0,y:0};
    
    
    v0.x = - cellSize * 0.48 + c.x;
    v0.y = - cellSize * 0.48 + c.y;
    v1.x = cellSize * 0.48 + c.x;
    v1.y = - cellSize * 0.48 + c.y;
    v2.x = cellSize * 0.48 + c.x;
    v2.y = cellSize * 0.48 + c.y;
    v3.x = - cellSize * 0.48 + c.x;
    v3.y = cellSize * 0.48 + c.y;
    
    ctx.moveTo( v0.x, v0.y );
    ctx.lineTo( v1.x, v1.y );
    ctx.lineTo( v2.x, v2.y );
    ctx.lineTo( v3.x, v3.y );
    ctx.lineTo( v0.x, v0.y );
    ctx.moveTo( v0.x, v0.y );
    ctx.lineTo( v2.x, v2.y );
    ctx.moveTo( v1.x, v1.y );
    ctx.lineTo( v3.x, v3.y );
    
    ctx.closePath();
    ctx.stroke();
  };

  this.draw3d = function() {
    mvPushMatrix();
    
    mat4.translate(mvMatrix, [this.posX/2.0, this.posY/2.0, 0.0]);
    mat4.scale(mvMatrix, [0.25, 0.25, 0.25]);
    mat4.translate(mvMatrix, [1.0, 1.0, 0.0]);

    gl.useProgram(this.shader);
    
    gl.uniform3fv(this.shader.color, this.colorV);
    bindAttributes(this);
    
    setMatrixUniforms(this.shader);
    
    gl.drawArrays(gl.TRIANGLES, 0, this.attributes.size);
    mvPopMatrix();
  };
}
TargetBox.prototype = new GameObject;
