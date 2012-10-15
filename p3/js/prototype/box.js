function Box(pos, dim) {
  this.pos = pos;

  this.yaw = 0;
  this.pitch = 0;
  this.rotating = false;
  this.rotatingSpeed = .6 * Math.random() - .3;

  if (shadows) {
    this.shaderName = "basic_shadow";
  } else {
    this.shaderName = "basic";
  }

  this.setup3d = function() {
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
  };

  // had to put after setup3d
  if (pos && dim) {
    this.width = dim[0];
    this.depth = dim[1];
    this.height = dim[2];

    this.setup3d();
    this.init3d();
  }

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

function ColorBox(pos, dim, color) {
  this.pos = pos;
  this.health = 100;
  this.width = dim[0];
  this.depth = dim[1];
  this.height = dim[2];

  this.color3d = color;

  if (shadows) {
    this.shaderName = "color_shadow";
  } else {
    this.shaderName = "color";
  }

  if (pos && dim) {
    this.setup3d();
    this.init3d();
  }
}
ColorBox.prototype = new Box;

function InvertedBox(pos, dim, color) {
  this.pos = pos;

  this.width = dim[0];
  this.depth = dim[1];
  this.height = dim[2];

  this.color3d = color;

  if (shadows) {
    this.shaderName = "color_shadow";
  } else {
    this.shaderName = "color";
  }

  if (pos && dim) {
    this.setup3d();

    this.normals = [0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,

		    -1.0, 0.0, 0.0,
		    -1.0, 0.0, 0.0,
		    -1.0, 0.0, 0.0,
		    -1.0, 0.0, 0.0,

		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,

		    0.0, -1.0, 0.0,
		    0.0, -1.0, 0.0,
		    0.0, -1.0, 0.0,
		    0.0, -1.0, 0.0,

		    0.0, 1.0, 0.0,
		    0.0, 1.0, 0.0,
		    0.0, 1.0, 0.0,
		    0.0, 1.0, 0.0
		   ];

    this.init3d();
  }
}
InvertedBox.prototype = new Box;
