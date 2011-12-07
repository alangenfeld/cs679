function ModelMan(pos, modelName) {
  this.pos = pos;
  loadModel(this, modelName);
  this.shaderName = "basic";
  this.init3d();

  this.draw = function() {
    mPushMatrix();
    mat4.translate(mMatrix, this.pos);
    this.draw3d();
    mPopMatrix();
  };
}
ModelMan.prototype = new GameObject3D;
