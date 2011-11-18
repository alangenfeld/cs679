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
    for (var i=0; i<5; i++) {
      shadowPass = i;
      gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFB[i]);
      gl.viewport(0, 0, shadowMapFB.width, shadowMapFB.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      light.set(i);
      objectManager.drawAll();

      gl.bindTexture(gl.TEXTURE_2D, shadowMapTex[i]);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    shadowPass = -1;

    /**
     * render objects
     */

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, display.width, display.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
