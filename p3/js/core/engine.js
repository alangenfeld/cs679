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


    /**
     * render shadow map
     */
    shadowPass = true;
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFB);
    gl.viewport(0, 0, shadowMapFB.width, shadowMapFB.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, shadowMapFB.width / shadowMapFB.height, 
		     0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    light.set();
    objectManager.drawAll();
    gl.bindTexture(gl.TEXTURE_2D, shadowMapTex);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    shadowPass = false;

    /**
     * render objects
     */
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, display.width, display.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, display.width / display.height, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    camera.set();
    objectManager.drawAll();

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
