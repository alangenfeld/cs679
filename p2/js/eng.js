/*******************************************************************************
 * Core game engine
 *******************************************************************************/

// drawing context
var display = $("display");
var ctx = display.getContext("2d");
var targetFPS = 60;

// stats
var lastRender, loopStart, updateFinish, renderFinish;
var updateStats = function() {
  if(statsOn){
    $("ut").innerHTML = (updateFinish - loopStart) + " ms";
    $("rt").innerHTML = (renderFinish - updateFinish) + " ms";
    $("fps").innerHTML = (Math.floor(1000 / (renderFinish - lastRender))) + " fps";
    $("num_objs").innerHTML = (objectManager.objects.length);
  }
  lastRender = renderFinish;
  return (1000/targetFPS) - (renderFinish - loopStart);
};

/**
 * Base game object class
 */
function GameObject() {
  this.x = 0;
  this.y = 0;

  this.init = function() {
    objectManager.objects.push(this);
  };

  this.update = function() {
    return;
  };

  this.draw = function() {
    return;
  };

  this.shutdown = function() {
    objectManager.remove(this);
  };
}

/**
 * Ye Olde Manager of Objects
 */
function ObjectManager() {
  this.objects = new Array();

  this.updateAll = function() {
    for (idx in this.objects) {
      this.objects[idx].update();
    }
  };

  this.drawAll = function() {
    for (idx in this.objects) {
      this.objects[idx].draw();
    }
  };

  this.remove = function(obj) {
    this.objects.splice(this.objects.indexOf(obj), 1);
  };

  this.clear = function() {
    this.objects = new Array();
  };
};
var objectManager = new ObjectManager;

// Moved here to make firefox happy
var bucketManager = new BucketManager(display.width, display.height);

/**
 * Ye Olde Manager of Objects
 */
function ResourceManager() {
  this.images = {"null":null};
  
  this.addImage = function(name, src) {
    var newImg = new Image;
    newImg.src = src;
    this.images[name] = newImg;
  };
  this.getImage = function(name) {
    return this.images[name];
  };
}
var resourceManager = new ResourceManager;

/**
 * The heart of the beast
 */
var Game = function() {
  this.paused = false;
  this.gloop = null;
  this.reset = null;

  this.pause = function () {
    if (this.paused) {
      this.paused = false;      
      this.start();
    } else {
      this.paused = true;
      this.gloop = null;
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
    loopStart = Date.now();
    
    // update each game object
    objectManager.updateAll();
    updateFinish = Date.now();
    
    // clear screen and redraw objects
    ctx.clearRect(0, 0, display.width, display.height);

    objectManager.drawAll();
    renderFinish = Date.now();
    
    var sleep = updateStats();
    if (game.paused) {
      this.gloop = setTimeout(game.wait, sleep);
    } else {
      this.gloop = setTimeout(game.start, sleep);
    }
  };
};
var game = new Game;

/**
 * Mouse singleton
 */
function Mouse() {
  this.x = 0;
  this.y = 0;
  this.leftPressed = false;
  this.rightPressed = false;

  function press(e) {
    if(e.which == 1) {
      this.leftPressed = true;
    } else if(e.which == 3) {
      this.rightPressed = true;
    }
  };
  display.onmousedown = press.bind(this);
  
  function unpress(e) {
    if(e.which == 1) {
      this.leftPressed = false;
    } else if(e.which == 3) {
      this.rightPressed = false;
    }
  };
  display.onmouseup = unpress.bind(this);

  function move(e) {
    this.x = e.offsetX? e.offsetX: e.layerX;
    this.y = e.offsetY? e.offsetY: e.layerY;
  };
  display.onmousemove = move.bind(this);

  // disable context menu
  function disableContextMenu(e) {
    return false;
  };
  display.oncontextmenu = disableContextMenu.bind(this);

  // prevent double click from highlighting text 
  display.onselectstart = function () {
    return false;
  };
}
var mouse = new Mouse;
  
/**
 * Keyboard singleton
 */
function Keyboard() {
  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;
  this.space = false;

  function handleKeyDown(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
      this.left = true;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
      this.right = true;
    } else if(e.keyCode == 32) {
      this.space = true;
    }
  };
  window.onkeydown = handleKeyDown.bind(this);
  
  function handleKeyUp(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
      this.left = false;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
      this.right = false;
    } else if(e.keyCode == 32) {
      this.space = false;
    }
  };
  window.onkeyup = handleKeyUp.bind(this);
}
var keyboard = new Keyboard;
