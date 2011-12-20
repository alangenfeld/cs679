// drawing context
var display = $("display");
var display2 = $("display2");
var gl = display.getContext("webgl") || display.getContext("experimental-webgl");  
var ctx = display2.getContext("2d");

var shadows = false;
var showDepthMapFace = -1;

//gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clearColor(0,0,0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.BLEND);
var mMatrix = mat4.create();
var mMatrixStack = [];
var vMatrix = mat4.create();
var pMatrix = mat4.create();
var lpMatrix = mat4.create();

function mPushMatrix() {
  var copy = mat4.create();
  mat4.set(mMatrix, copy);
  mMatrixStack.push(copy);
}

function mPopMatrix() {
  if (mMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mMatrix = mMatrixStack.pop();
}

function setShadowUniforms(shader, i) {
  gl.uniformMatrix4fv(shader.mMatrix, false, mMatrix);
}

function setMatrixUniforms(shader) {
  gl.uniformMatrix4fv(shader.pMatrix, false, pMatrix);
  gl.uniformMatrix4fv(shader.lpMatrix, false, lpMatrix);
  gl.uniformMatrix4fv(shader.mMatrix, false, mMatrix);
  gl.uniformMatrix4fv(shader.vMatrix, false, vMatrix);

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mMatrix, normalMatrix);
  mat3.transpose(mMatrix);
  gl.uniformMatrix3fv(shader.nMatrix, false, normalMatrix);
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

var shadowCubeFB = Array();
shadowCubeFB.width = 512;
shadowCubeFB.height = 512;
var shadowCubeTex;

function initShadowMaps() {
  // create the cube map texture context
  shadowCubeTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowCubeTex);

  for (var i=0; i < 6; i++) {
    // create frame buffer to render into 
    shadowCubeFB[i] = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowCubeFB[i]);

    // reserve space in GPU for image
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, shadowCubeFB.width, shadowCubeFB.height, 
		  0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  
    // create and set up a render buffer
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, shadowCubeFB.width, shadowCubeFB.height);
    
    // attach the frame buffer to the cube map
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, shadowCubeTex, 0);

    // attach the render buffer to the current frame buffer
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
  }

//  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
//  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
//  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
initShadowMaps();
