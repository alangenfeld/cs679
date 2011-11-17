function Shader(name) {
  if (!name) {
    throw("shaderName not set");
  }

  this.program = getShader(name);
  this.shadowMapper = getShader("shadowmap");

  this.setAttribute = function(obj, attrib) {
    obj[attrib.name] = gl.createBuffer();
    gl.bindBuffer(attrib.type, obj[attrib.name]);

    var array = attrib.type == gl.ELEMENT_ARRAY_BUFFER ? 
      new Uint16Array(attrib.content) : new Float32Array(attrib.content);

    gl.bufferData(attrib.type, array, gl.STATIC_DRAW);

    this.program[attrib.name] = gl.getAttribLocation(this.program, attrib.name);
    gl.enableVertexAttribArray(this.program[attrib.name]);

    if (!obj.attributes) {
      obj.attributes = new Array();
    }
    
    obj.attributes.push(attrib);
  };

  this.bindAttributes = function(obj) {
    for (var i in obj.attributes) {
      var name = obj.attributes[i].name;
      gl.bindBuffer(obj.attributes[i].type, obj[name]);
      if (obj.attributes[i].type == gl.ARRAY_BUFFER) {
	gl.vertexAttribPointer(this.program[name], 
			       obj.attributes[i].size, 
			       gl.FLOAT, false, 0, 0);	
      }
    }
  };

  this.setShadowVertex = function(obj, verts) {
    obj["shadowVertex"] = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, obj["shadowVertex"]);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    this.shadowMapper["vertex"] = gl.getAttribLocation(this.shadowMapper, "vertex");
    gl.enableVertexAttribArray(this.shadowMapper["vertex"]);
  };
  
  this.bindShadowVertex = function(obj) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj["shadowVertex"]);
    gl.vertexAttribPointer(this.shadowMapper["vertex"], 3,
			   gl.FLOAT, false, 0, 0);
  };


  this.setUpLights = function() {
    this.program.lightPos = gl.getUniformLocation(this.program, "lightPos");
    this.program.lightCol = gl.getUniformLocation(this.program, "lightCol");
    this.program.ambient = gl.getUniformLocation(this.program, "ambient");
    this.program.attenuation = gl.getUniformLocation(this.program, "attenuation");
  };

  this.bindLights = function() {
//    gl.uniform3fv(this.program.lightPos, light.transformedPos);
    gl.uniform3fv(this.program.lightPos, light.pos);
    gl.uniform3fv(this.program.lightCol, light.col);
    gl.uniform3fv(this.program.ambient, light.ambient);
    gl.uniform3fv(this.program.attenuation, light.attenuation);
  };

  this.setTexture = function(texName) {
    this.program.texture = gl.getUniformLocation(this.program, "texture");
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
    gl.uniform1i(this.program.texture, 0);
  };

  this.setShadowMap = function() {
    this.program.shadowMap = gl.getUniformLocation(this.program, "shadowMap");
  };

  this.bindShadowMap = function() {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, shadowMapTex);
    gl.uniform1i(this.program.shadowMap, 1);
  };
};
