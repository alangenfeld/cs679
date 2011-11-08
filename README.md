DAT COMPUTER GAMES COURSE

Welcome to zombocom. The only limit is your self.

This engine is very simple. Each iteration through the game loop updates and draws each object.

Current How To

#Step 1: Make a "class"
```javascript
// give your "class" an awesome and unique name
function AwesomeBox(attributes) {
  // save any attributes to the object
  this.attributes = attributes
  
  // set up the shader. fetches the pair box.vs and box.fs
  this.shader = getShader("box");

  // set static attributes like vertices, normals, or texture coordinates
  setAttribute(this,
	       {name: "vtx",
		content: [
		0,0,0,		
		0,0,0,		
		0,0,0		
		],
		size: 3
	       });
  // setUpLights or setTexture can be used for lights/textures
  // set the number of elements
  this.attributes.num = 4;


  // this call inherited from GameObject, adds the object to be updated and drawn
  this.init();

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

    // set the current shader
    gl.useProgram(this.shader);

    // perform translations or rotations
    //    mat4.translate(mvMatrix, ...
    //    mat4.rotate(mvMatrix, ...

    // bindTexture bindLights optionally used
    // bind the attributes of this object
    bindAttributes(this);
 
    // set the modelview, perspective and normal matricies
    setMatrixUniforms(this.shader);
    
    // draw dat stuff
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.attributes.num);

    // clean up and leave
    mvPopMatrix();
  }
}
// this causes the object to inherit the base object class, giving it access to 
// init, update and draw calls. 
AwesomeBox.prototype = new GameObject;
```
