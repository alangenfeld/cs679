// drawing context
var display = $("display");
var gl = display.getContext("experimental-webgl");
var ctx = display2.getContext("2d");

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.enable(gl.DEPTH_TEST);
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms(shader) {
  gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shader.nMatrixUniform, false, normalMatrix);
}


function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

// shim layer with setTimeout fallback
window.requestAnimFrame = 
  (function() {
    return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function(/* function */ callback, /* DOMElement */ element){
	window.setTimeout(callback, 1000 / 60);
      };
   })();
function getShader(name) {
  var shaderProgram = shaderMap[name];
  if (!shaderProgram) {
    // load the shaders from files
    var fragmentShader = loadShaders(gl, "shader/"+name+".vs")[0];
    var vertexShader   = loadShaders(gl, "shader/"+name+".fs")[0];
    // build the shaderProgram object
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // make sure all is well
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderMap[name] = shaderProgram;
  }

  return shaderProgram;
}

function setAttribute(obj, attrib) {
  obj[attrib.name] = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, obj[attrib.name]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attrib.content), gl.STATIC_DRAW);
  obj.shader[attrib.name] = gl.getAttribLocation(obj.shader, attrib.name);
  gl.enableVertexAttribArray(obj.shader[attrib.name]);

  if (!obj.attributes) {
    obj.attributes = new Array();
  }
  obj.attributes.push(attrib.name);
}

function bindAttributes(obj) {
  for (var i in obj.attributes) {
    var name = obj.attributes[i];
    gl.bindBuffer(gl.ARRAY_BUFFER, obj[name]);
    gl.vertexAttribPointer(obj.shader[name], 3, gl.FLOAT, false, 0, 0);
  }
}

function setUpLights(shader) {
  shader.lightPos = gl.getUniformLocation(shader, "lightPos");
  shader.lightCol = gl.getUniformLocation(shader, "lightCol");
  shader.ambient = gl.getUniformLocation(shader, "ambient");
}

var light = {
  pos : [0, 0, 6.0],
  col : [1.0, 1.0, 1.0],
  ambient : [0.0, 0.0, 0.0]
};

function bindLights(shader) {
  var t = Date.now()/500;

  light.pos[0] = Math.cos(t)*9;
  light.pos[1] = Math.sin(t)*9;

  gl.uniform3fv(shader.lightPos, light.pos);
  gl.uniform3fv(shader.lightCol, light.col);
  gl.uniform3fv(shader.ambient, light.ambient);
}

