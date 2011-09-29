/*******************************************************************************
 * Core game engine
 *******************************************************************************/

// drawing context
var display = $("display");
var ctx = display.getContext("2d");
var targetFPS = 30;

// stats
var lastRender, loopStart, updateFinish, renderFinish;
var updateStats = function() {
  if(statsOn){
    $("ut").innerHTML = updateFinish - loopStart;
    $("rt").innerHTML = renderFinish - updateFinish;
    $("fps").innerHTML = Math.floor(1000 / (renderFinish - lastRender));
    $("num_objs").innerHTML = objectManager.objects.length;
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
    bucketManager.clear();
    bucketManager.add(g_boids);

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
};
var objectManager = new ObjectManager;

/**
 * The heart of the beast
 */
var GameLoop = function() {
  loopStart = Date.now();

  // update each game object
  objectManager.updateAll();
  updateFinish = Date.now();

  // clear screen and redraw objects
  ctx.clearRect(0, 0, display.width, display.height);
  objectManager.drawAll();
  renderFinish = Date.now();

  var sleep = updateStats();
  this.gloop = setTimeout(GameLoop, sleep);
};

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
      console.log("press");
      this.leftPressed = true;
	} else if(e.which == 3) {
      this.rightPressed = true;
	}
  };
  display.onmousedown = press.bind(this);

  function unpress(e) {
    if(e.which == 1) {
      console.log("unpress");
      this.leftPressed = false;
	} else if(e.which == 3) {
      this.rightPressed = false;
	}
  };
  display.onmouseup = unpress.bind(this);

  function move(e) {
    this.x = e.offsetX;
    this.y = e.offsetY;
  };
  display.onmousemove = move.bind(this);

  function leave(e) {
    this.leftPressed = false;
    this.rightPressed = false;
  };
  display.onmouseout = leave.bind(this);

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
