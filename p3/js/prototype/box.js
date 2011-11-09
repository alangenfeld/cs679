function Box(pos, width, depth, height) {
  this.width = size;
  this.height = h;
  this.pos = pos;
  this.rotate = {
    deg : rotationDegrees,
    vec : rotationVec  
  };
  this.shaderName = "basic";

  this.vertices = [this.width/2,  this.depth/2,  this.,
		   -this.width/2,  this.depth/2,  0.0,
		   this.width/2,  -this.depth/2,  0.0,
		   -this.width/2,  -this.depth/2,  0.0



		  ];

  this.normals = [0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0];

  
}
Box.prototype = new GameObject3D;



/**
  this.texName = "wall.png";
  this.texCoords = [1.0,  1.0,
		    0.0,  1.0,
		    1.0,  0.0,
		    0.0,  0.0];

  this.light = true;
*/
