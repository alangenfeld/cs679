function Wall(pos, h, w, rotationDegrees, rotationVec) {
  this.width = w;
  this.depth = h;
  this.pos = pos;
  this.rotate = {
    deg : rotationDegrees,
    vec : rotationVec  
  };
  this.shaderName = "textured";

  this.vertices = [this.width/2,  this.depth/2,  0.0,
		   -this.width/2,  this.depth/2,  0.0,
		   this.width/2,  -this.depth/2,  0.0,
		   -this.width/2,  -this.depth/2,  0.0];

  this.normals = [0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0];

  this.textureName = "wall.png";
  this.texCoords = [1.0,  1.0,
		    0.0,  1.0,
		    1.0,  0.0,
		    0.0,  0.0];

  this.light = true;
  this.attributeCount = 4;

  this.init3d();

  this.draw = function() {
    mvPushMatrix();

    mat4.translate(mvMatrix, this.pos);
    mat4.rotate(mvMatrix, degToRad(this.rotate.deg), this.rotate.vec);

    this.draw3d();

    mvPopMatrix();
  };
}
//Wall.prototype = new GameObject;
Wall.prototype = new GameObject3D;

function Room() {
  this.walls = new Array();
  
  this.walls.push(new Wall([0,0,0], 10, 10, 0, [0,0,0]));
  this.walls.push(new Wall([0,5,2.5], 5, 10, 90, [1,0,0]));
  this.walls.push(new Wall([5,0,2.5], 10, 5, -90, [0,1,0]));
  this.walls.push(new Wall([-5,0,2.5], 10, 5, 90, [0,1,0]));
  
}
Room.prototype = new GameObject;
