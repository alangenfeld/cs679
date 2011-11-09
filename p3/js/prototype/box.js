function Box(pos, width, depth, height) {
  this.pos = pos;

  this.width = width;
  this.depth = depth;
  this.height = height;

  this.shaderName = "basic";
// NOT DONE
  this.vertices = [this.width/2,  this.depth/2,  this.height,
		   -this.width/2,  this.depth/2,  this.height,
		   this.width/2,  -this.depth/2,  this.height,
		   -this.width/2,  -this.depth/2,  this.height,

		   this.width/2,  this.depth/2,  -this.height,
		   -this.width/2,  this.depth/2,  -this.height,
		   this.width/2,  -this.depth/2,  -this.height,
		   -this.width/2,  -this.depth/2,  -this.height,

		   this.width/2,  this.depth/2,  this.height,
		   this.width/2,  this.depth/2,  -this.height,
		   this.width/2,  -this.depth/2,  -this.height,
		   this.width/2,  -this.depth/2,  this.height,

		   -this.width/2,  this.depth/2,  this.height,
		   -this.width/2,  this.depth/2,  -this.height,
		   -this.width/2,  -this.depth/2,  -this.height,
		   -this.width/2,  -this.depth/2,  this.height,
//TO DO HERERERERE
		   this.width/2,  this.depth/2,  this.height,
		   -this.width/2,  this.depth/2,  this.height,
		   this.width/2,  this.depth/2,  this.height,
		   -this.width/2,  this.depth/2,  this.height,

		   this.width/2, -this.depth/2,  this.height,
		   -this.width/2, -this.depth/2,  this.height,
		   this.width/2, -this.depth/2,  this.height,
		   -this.width/2, -this.depth/2,  this.height
		  ];

  this.normals = [0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0
		  
		  0.0,  0.0,  -1.0,
		  0.0,  0.0,  -1.0,
		  0.0,  0.0,  -1.0,
		  0.0,  0.0,  -1.0

		  1.0,  0.0,  0.0,
		  1.0,  0.0,  0.0,
		  1.0,  0.0,  0.0,
		  1.0,  0.0,  0.0,

		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0

		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0
		 ];

  
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
