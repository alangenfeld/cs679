function Box(pos, dim) {
  this.pos = pos;

  this.width = dim[0];
  this.depth = dim[1];
  this.height = dim[2];

  this.shaderName = "basic";

  this.vertices = [this.width/2,  this.depth/2,  this.height/2,
		   -this.width/2,  this.depth/2,  this.height/2,
		   -this.width/2,  -this.depth/2,  this.height/2,
		   this.width/2,  -this.depth/2,  this.height/2,

		   this.width/2,  this.depth/2,  -this.height/2,
		   -this.width/2,  this.depth/2,  -this.height/2,
		   -this.width/2,  -this.depth/2,  -this.height/2,
		   this.width/2,  -this.depth/2,  -this.height/2,

		   this.width/2,  this.depth/2,  this.height/2,
		   this.width/2,  this.depth/2,  -this.height/2,
		   this.width/2,  -this.depth/2,  -this.height/2,
		   this.width/2,  -this.depth/2,  this.height/2,

		   -this.width/2,  this.depth/2,  this.height/2,
		   -this.width/2,  this.depth/2,  -this.height/2,
		   -this.width/2,  -this.depth/2,  -this.height/2,
		   -this.width/2,  -this.depth/2,  this.height/2,

		   this.width/2,  this.depth/2,  this.height/2,
		   -this.width/2,  this.depth/2,  this.height/2,
		   -this.width/2,  this.depth/2,  -this.height/2,
		   this.width/2,  this.depth/2,  -this.height/2,

		   this.width/2, -this.depth/2,  this.height/2,
		   -this.width/2, -this.depth/2,  this.height/2,
		   -this.width/2, -this.depth/2,  -this.height/2,
		   this.width/2, -this.depth/2,  -this.height/2
		  ];

  this.normals = [0.0, 0.0, 1.0,
		  0.0, 0.0, 1.0,
		  0.0, 0.0, 1.0,
		  0.0, 0.0, 1.0,
		  
		  0.0, 0.0, -1.0,
		  0.0, 0.0, -1.0,
		  0.0, 0.0, -1.0,
		  0.0, 0.0, -1.0,

		  1.0, 0.0, 0.0,
		  1.0, 0.0, 0.0,
		  1.0, 0.0, 0.0,
		  1.0, 0.0, 0.0,

		  -1.0, 0.0, 0.0,
		  -1.0, 0.0, 0.0,
		  -1.0, 0.0, 0.0,
		  -1.0, 0.0, 0.0,

		  0.0, 1.0, 0.0,
		  0.0, 1.0, 0.0,
		  0.0, 1.0, 0.0,
		  0.0, 1.0, 0.0,

		  0.0, -1.0, 0.0,
		  0.0, -1.0, 0.0,
		  0.0, -1.0, 0.0,
		  0.0, -1.0, 0.0
		 ];

  this.vtxIndex = [0,1,2, 0,2,3,
		   4,5,6, 4,6,7,
		   8,9,10, 8,10,11,
		   12,13,14, 12,14,15,
		   16,17,18, 16,18,19,
		   20,21,22, 20,22,23
		  ];

  this.light = true;
  this.attributeCount = 24;

  this.init3d();

  this.draw = function() {
    mvPushMatrix();

    mat4.translate(mvMatrix, this.pos);

    this.draw3d();

    mvPopMatrix();
  };
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
