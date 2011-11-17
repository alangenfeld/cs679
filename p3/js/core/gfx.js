// drawing context
var display = $("display");
var display2 = $("display2");
var gl = display.getContext("experimental-webgl");
var ctx = display2.getContext("2d");

//gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clearColor(0,0,0, 1.0);
gl.enable(gl.DEPTH_TEST);
var mMatrix = mat4.create();
var mMatrixStack = [];
var vMatrix = mat4.create();
var pMatrix = mat4.create();
var lMatrix = mat4.create();

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

function setMatrixUniforms(shader) {
  gl.uniformMatrix4fv(shader.pMatrix, false, pMatrix);
  gl.uniformMatrix4fv(shader.mMatrix, false, mMatrix);
  gl.uniformMatrix4fv(shader.vMatrix, false, vMatrix);
  gl.uniformMatrix4fv(shader.lMatrix, false, lMatrix);
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

var shadowMapFB;
var shadowMapTex;
initTextureFramebuffer();
function initTextureFramebuffer() {
  shadowMapFB = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFB);
  shadowMapFB.width = 512;
  shadowMapFB.height = 512;
  
  shadowMapTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, shadowMapTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, shadowMapFB.width, shadowMapFB.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  
  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, shadowMapFB.width, shadowMapFB.height);
  
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowMapTex, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
