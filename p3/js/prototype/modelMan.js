function ModelMan(pos, modelName) {
  this.pos = pos;

  this.yaw = 0;
  this.pitch = 0;
  this.roll = 0;


  this.rotatingSpeed = 0 ; 

  loadModel(this, modelName);
  this.color3d = [.2, 0, .2];
  if (shadows) {
    this.shaderName = "color_shadow";
  } else {
    this.shaderName = "color";
  }

  this.init3d();

  this.update = function() {
    this.yaw += this.rotatingSpeed;    
    this.pitch += this.rotatingSpeed;    
  };

  this.draw = function() {
    mPushMatrix();
    mat4.translate(mMatrix, this.pos);

    mat4.rotate(mMatrix, degToRad(this.roll), [0, 0, 1]);
    mat4.rotate(mMatrix, degToRad(this.yaw), [0, 1, 0]);
    mat4.rotate(mMatrix, degToRad(this.pitch), [1, 0, 0]);


    this.draw3d();
    mPopMatrix();
  };
}
ModelMan.prototype = new GameObject3D;
