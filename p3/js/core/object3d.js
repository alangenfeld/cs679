function GameObject3D() {
  this.shader = null;
  this.shaderName = null;  
  this.vertices = null;
  this.normals = null;
  this.texCoords = null;
  this.textureName = null;
  this.light = false;

  this.init3d = function() {
    this.shader = new Shader(this.shaderName);

    if (this.vertices) {
      this.shader.setAttribute(this, {name:"vertex", 
				      content: this.vertices, 
				      type : gl.ARRAY_BUFFER,
				      size: 3});
      this.shader.setShadowVertex(this, this.vertices, this.vtxIndex);
    }
    if (this.normals) {
      this.shader.setAttribute(this, {name:"normal", 
				      content: this.normals, 
				      type : gl.ARRAY_BUFFER,
				      size: 3});
    }
    if (this.texCoords) {
      this.shader.setAttribute(this, {name:"uv",
				      content: this.texCoords,
				      type : gl.ARRAY_BUFFER,
				      size: 2});
    }
    if (this.vtxIndex) {
      this.shader.setAttribute(this, {name:"vtxIndexBuffer",
				      content: this.vtxIndex,
				      type : gl.ELEMENT_ARRAY_BUFFER,
				      size: 1});
    }


    
    if (this.textureName) {
      this.shader.setTexture(this.textureName);
    }
    if (this.color3d) {
      this.shader.setUpColor();
    }
    if (this.light) {
      this.shader.setUpLights();
      this.shader.setShadowCube();
    }

    this.init();
  };

  this.draw3d = function() {
    if (!this.attributeCount) {
      throw("attributeCount not set!");
    }

    if (shadowPass >= 0) {
      gl.useProgram(this.shader.shadowMapper);
      setMatrixUniforms(this.shader.shadowMapper);
      this.shader.bindShadowVertex(this);      

    } else {
      gl.useProgram(this.shader.program);
      setMatrixUniforms(this.shader.program);
      
      if (this.light) {
	this.shader.bindLights();
	this.shader.bindShadowCube();
      }
      if (this.color3d) {
	this.shader.bindColor(this.color3d);
      }
      if (this.shader.texture) {
	this.shader.bindTexture();      
      }
      this.shader.bindAttributes(this);      
    }

    if (this.vtxIndex) {
      gl.drawElements(gl.TRIANGLES, this.vtxIndex.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.attributeCount);
    }

//    gl.bindTexture(gl.TEXTURE_2D, null);
  };


}
GameObject3D.prototype = new GameObject;
