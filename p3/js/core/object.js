/**
 * Base game object class
 */
function GameObject() {
  this.render = true;
  this.shadow = true;
  this.enabled = true;

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
      if (this.objects[idx].enabled) {
	this.objects[idx].update();	
      }
    }
  };

  this.drawAll = function() {
    for (idx in this.objects) {
      if (shadowPass >= 0 && this.objects[idx].shadow && this.objects[idx].enabled) {
	this.objects[idx].draw();
      } else if (shadowPass < 0 && this.objects[idx].render && this.objects[idx].enabled) {
	this.objects[idx].draw();
      }
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
