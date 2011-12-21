/*******************************************************************************
 * Core game engine
 *******************************************************************************/
var Game = function() {
  this.paused = false;
  this.reset = null;
  this.tick = 0;

  this.pause = function () {
    if (this.paused) {
      this.paused = false;      
      this.start();
    } else {
      this.paused = true;
    }
  };

  this.wait = function() {
    if(keyboard.space) {
      if (game.reset) {
	game.reset();
	game.reset = null;
      }
      game.paused = false;
      game.start();
    } else {
      // fix for delay of game over message in some browsers
      render();
      this.gloop = setTimeout(game.wait, 30);
    }
  };

  // takes a reset function as a callback
  this.over = function(rst) {
    this.paused = true;
    this.reset = rst;
  };

  this.start = function() {
    game.tick++;
    loopStart = Date.now();
    
    // update each game object
    objectManager.updateAll();
    updateFinish = Date.now();
    
    // clear 2d canvas
    ctx.clearRect(0, 0, display2.width, display2.height);

    render();
    renderFinish = Date.now();
    
    updateStats();
    if (game.paused) {
      //requestAnimFrame(game.wait, display);
      this.gloop = setTimeout(game.wait, 30);
    } else {
      requestAnimFrame(game.start, display);
    }
  };
};
var game = new Game;

shadowPass = -1;
function render() {
  if (showDepthMapFace < 0) {
    if (shadows) {
       renderShadowMaps();
    }
    renderObjects();
  } else {
    renderMapToScreen(showDepthMapFace);
  }
}

function renderShadowMaps() {
  mat4.perspective(90, shadowCubeFB.width / shadowCubeFB.height, 
		   0.01, 100.0, lpMatrix);
  
  for (var i=0; i<6; i++) {
    shadowPass = i;
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowCubeFB[i]);
    gl.viewport(0, 0, shadowCubeFB.width, shadowCubeFB.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    light.set(i);
    objectManager.drawAll();
  }
  shadowPass = -1;
  // update cube map
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowCubeTex);
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
}

function renderMapToScreen(i) {
  mat4.perspective(90, shadowCubeFB.width / shadowCubeFB.height, 
		   0.01, 100.0, lpMatrix);
  
  shadowPass = i;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, shadowCubeFB.width, shadowCubeFB.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  light.set(i);
  objectManager.drawAll();
}


function renderObjects() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, display.width, display.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  camera.set();
  objectManager.drawAll();
}
