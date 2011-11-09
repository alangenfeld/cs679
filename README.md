DAT COMPUTER GAMES COURSE

Welcome to zombocom. The only limit is your self.

This engine is very simple. Each iteration through the game loop updates and draws each object.

Current How To

Step 1: Make a "class"

```javascript

// give your "class" an awesome and unique name
function AwesomeBox(attributes) {
  // save any attributes to the object
  this.attributes = attributes
  
  // set up the shader. fetches the pair basic.vs and basic.fs
  this.shaderName = "basic";

  // set static attributes like vertices, normals, or texture coordinates
  this.vertices = [0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0,
		  0.0,  0.0,  1.0];


  this.attributeCount = 4;

  // this call inherited from GameObject3D, adds the object to be updated and drawn
  this.init3d();

  // optionaly override the update call. Use this to compute any state changes for your object
  this.update = function() {
    // game.tick is the current iteration through the game loop.
    // use this to measure time, as Date.now() will break if the game gets paused
    if (game.tick - this.lastDoStuff) {
      // do stuff...
      this.lastDoStuff = game.tick;
    }
  };

  // if your object exists visualy in the world, override this function
  this.draw = function() {
    // push the model view matrix
    mvPushMatrix();

    // perform translations or rotations
    //    mat4.translate(mvMatrix, ...
    //    mat4.rotate(mvMatrix, ...

    // draw dat stuff
    draw3d();

    // clean up and leave
    mvPopMatrix();
  }
}
// this causes the object to inherit the base object class, giving it access to 
// init, update and draw calls. 
AwesomeBox.prototype = new GameObject;
```

Step 2: Make a game

```javascript
// First setup any initial game objects

// when the object is created, the init() call will add the object to the manager,
// and when the game is started it will be updated and drawn accordingly. 
var awesomeBox = new AwesomeBox();
// to remove the object, use awesomeBox.shutdown()

// Then start the game. Tts that easy.
game.start();
```
