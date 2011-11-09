function GameObject3D() {
  this.shader = null;
  this.shaderName = null;  
  this.vertices = null;
  this.normals = null;
  this.texCoords = null;
  this.textureName = null;
  this.light = false;

  this.init3d = function() {
    if (!this.shaderName) {
      throw("shaderName not set");
    }
    this.shader = getShader(this.shaderName);    
    if (this.vertices) {
      this.setAttribute({name:"vertex", 
			 content: this.vertices, 
			 type : gl.ARRAY_BUFFER,
			 size: 3});
    }
    if (this.normals) {
      this.setAttribute({name:"normal", 
			 content: this.normals, 
			 type : gl.ARRAY_BUFFER,
			 size: 3});
    }
    if (this.texCoords) {
      this.setAttribute({name:"uv",
			 content: this.texCoords,
			 type : gl.ARRAY_BUFFER,
			 size: 2});
    }
    if (this.vtxIndex) {
      this.setAttribute({name:"vtxIndexBuffer",
			 content: this.vtxIndex,
			 type : gl.ELEMENT_ARRAY_BUFFER,
			 size: 1});
    }

    
    if (this.textureName) {
      this.setTexture(this.textureName);
    }
    if (this.light) {
      this.setUpLights();
    }

    this.init();
  };

  this.draw3d = function() {
    if (!this.attributeCount) {
      throw("attributeCount not set!");
    }
    gl.useProgram(this.shader);
    setMatrixUniforms(this.shader);

    if (this.light) {
      this.bindLights();
    }
    if (this.texture) {
      this.bindTexture();      
    }
    this.bindAttributes();      


    if (this.vtxIndex) {
      gl.drawElements(gl.TRIANGLES, this.vtxIndex.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.attributeCount);
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
  };

  this.setAttribute = function(attrib) {
    this[attrib.name] = gl.createBuffer();
    gl.bindBuffer(attrib.type, this[attrib.name]);

    var array = attrib.type == gl.ELEMENT_ARRAY_BUFFER ? 
      new Uint16Array(attrib.content) : new Float32Array(attrib.content);

    gl.bufferData(attrib.type, array, gl.STATIC_DRAW);

    this.shader[attrib.name] = gl.getAttribLocation(this.shader, attrib.name);
    gl.enableVertexAttribArray(this.shader[attrib.name]);
    
    if (!this.attributes) {
      this.attributes = new Array();
    }
    
    this.attributes.push(attrib);
  };

  this.bindAttributes = function() {
    for (var i in this.attributes) {
      var name = this.attributes[i].name;
      gl.bindBuffer(this.attributes[i].type, this[name]);
      if (this.attributes[i].type == gl.ARRAY_BUFFER) {
	gl.vertexAttribPointer(this.shader[name], 
			       this.attributes[i].size, 
			       gl.FLOAT, false, 0, 0);	
      }
    }
  };

  this.setUpLights = function() {
    this.shader.lightPos = gl.getUniformLocation(this.shader, "lightPos");
    this.shader.lightCol = gl.getUniformLocation(this.shader, "lightCol");
    this.shader.ambient = gl.getUniformLocation(this.shader, "ambient");
    this.shader.attenuation = gl.getUniformLocation(this.shader, "attenuation");
  };

  this.bindLights = function() {
    gl.uniform3fv(this.shader.lightPos, light.transformedPos);
    gl.uniform3fv(this.shader.lightCol, light.col);
    gl.uniform3fv(this.shader.ambient, light.ambient);
    gl.uniform3fv(this.shader.attenuation, light.attenuation);
  };

  this.setTexture = function(texName) {
    this.shader.texture = gl.getUniformLocation(this.shader, "texture");
    var img = new Image();
    this.texture = gl.createTexture();
    this.texture.image = img;
    
    var tex = this.texture;
    img.onload = function () {
      handleLoadedTexture(tex);
    };
    
    img.src = "img/" + texName;
  };

  this.bindTexture = function() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.shader.texture, 0);
  };
}
GameObject3D.prototype = new GameObject;
