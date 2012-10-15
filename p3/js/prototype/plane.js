function Plane(pos, h, w, rotationDegrees, rotationVec, texName) {
  this.width = w;
  this.depth = h;
  this.pos = pos;
  this.rotate = {
    deg : rotationDegrees,
    vec : rotationVec  
  };
  
  if (shadows) {
    this.shaderName = "textured_shadow";
  } else {
    this.shaderName = "textured";
  }
  
  this.textureName = texName;

  this.vertices = [this.width/2,  this.depth/2,  0.0,
		   -this.width/2,  this.depth/2,  0.0,
		   this.width/2,  -this.depth/2,  0.0,
		   -this.width/2,  -this.depth/2,  0.0];
  
  this.normals = [0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0];
  
  this.texCoords = [1.0,  1.0,
		    0.0,  1.0,
		    1.0,  0.0,
		    0.0,  0.0];
  
  this.light = true;
  this.attributeCount = 4;

  this.init3d();    

  this.draw = function() {
    mPushMatrix();

    mat4.translate(mMatrix, this.pos);
    mat4.rotate(mMatrix, degToRad(this.rotate.deg), this.rotate.vec);

    this.draw3d();

    mPopMatrix();
  };
}
Plane.prototype = new GameObject3D;
