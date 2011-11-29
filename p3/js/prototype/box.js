function Box(pos, dim) {
  this.pos = pos;

  this.yaw = 0;
  this.pitch = 0;
  this.rotating = false;
  this.rotatingSpeed = .6 * Math.random() - .3;

  this.width = dim[0];
  this.depth = dim[1];
  this.height = dim[2];

  if (shadows) {
    this.shaderName = "basic_shadow";
  } else {
    this.shaderName = "basic";
  }

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


  this.update = function() {
    this.yaw += this.rotatingSpeed;    
    this.pitch += this.rotatingSpeed;    
  };

  this.draw = function() {
    mPushMatrix();


    mat4.translate(mMatrix, this.pos);
    if (this.rotating) {
      mat4.rotate(mMatrix, degToRad(this.yaw), [0, 1, 0]);
      mat4.rotate(mMatrix, degToRad(this.pitch), [1, 0, 0]);
    }

    this.draw3d();

    mPopMatrix();
  };
}
Box.prototype = new GameObject3D;
