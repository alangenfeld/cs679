function Wall(pos, h, w, rotationDegrees, rotationVec) {
  this.width = w;
  this.height = h;
  this.pos = pos;
  this.rotate = {
    deg : rotationDegrees,
    vec : rotationVec  
  };

  this.shader = getShader("wall");
  setAttribute(this, 
	       {name: "vtx",
		content: [
		  this.width/2,  this.height/2,  0.0,
		    -this.width/2,  this.height/2,  0.0,
		  this.width/2,  -this.height/2,  0.0,
		    -this.width/2,  -this.height/2,  0.0
		]});
  setAttribute(this, 
	       {name: "normal",
		content: [
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0
		]});
  
  setUpLights(this.shader);
  this.attributes.num = 4;
  this.init();

  this.draw = function() {
    mvPushMatrix();

    gl.useProgram(this.shader);

    mat4.translate(mvMatrix, this.pos);
    mat4.rotate(mvMatrix, degToRad(this.rotate.deg), this.rotate.vec);

    bindLights(this.shader);
    bindAttributes(this);

    setMatrixUniforms(this.shader);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.attributes.num);

    mvPopMatrix();
  };

}
Wall.prototype = new GameObject;

function Room() {
  this.walls = new Array();
  
  this.walls.push(new Wall([0,0,0], 10, 10, 0, [0,0,0]));
  this.walls.push(new Wall([0,5,2.5], 5, 10, 90, [1,0,0]));
  this.walls.push(new Wall([5,0,2.5], 10, 5, 90, [0,1,0]));
  this.walls.push(new Wall([-5,0,2.5], 10, 5, 90, [0,1,0]));
  
}
Room.prototype = new GameObject;
