/**
 * why not have some utility classes
 */
function $() {
  return document.getElementById.apply(document, arguments);
}

function Point(x, y) {
  this.x = x;
  this.y = y;

  this.move = function(v) {
    this.x += v.x;
    this.y += v.y;
  };

  this.distance = function(p) {
    x = p.x - this.x;
    y = p.y - this.y;
    return Math.sqrt(x*x + y*y);
  };

  this.vectorTo = function(p, mag) { 
    x = p.x - this.x;
    y = p.y - this.y;
    return new Vector(x, y, mag);
  };
}

function Vector(x, y, mag) {
  var length = Math.sqrt(x*x + y*y);
  if (!mag) {
    mag = 1;
  }

  this.x = 0;
  this.y = 0;

  if(length != 0) {
    this.x = (x/length) * mag;
    this.y = (y/length) * mag;
  }

  this.inverse = function() {
    this.x = -this.x;
    this.y = -this.y;
  };
}

function averageVectors(vectors, mag) {
  var x = 0;
  var y = 0;

  for (idx in vectors) {
    x += vectors[idx].x;
    y += vectors[idx].y;
  }
  x /= vectors.length;
  y /= vectors.length;
  return new Vector(x, y, g_speed);
}

/**
 * Spatial Bucket Manager
 *
 *  - buckets start at -100, -100
 *  - bucket size of 50x50
 */
function BucketManager(width, height) {
  this.width = width + 200;
  this.height = height + 200;

  this.bucket_width = 50;
  this.bucket_height = 50;
  this.numBucketsX = Math.ceil(this.width / this.bucket_width);
  this.numBucketsY = Math.ceil(this.height/ this.bucket_height);
  this.numBuckets = this.numBucketsX * this.numBucketsY;

  this.buckets = new Array(this.numBuckets);

  for(var i=0; i < this.buckets.length; i++) {
    this.buckets[i] = new Array();
  }

  this.add = function(objs) {
    //console.log("add()");
    //console.log(objs);
    for (idx in objs) {
      var index = (Math.floor(objs[idx].loc.y / this.bucket_height) + 2) * this.numBucketsX + (Math.floor(objs[idx].loc.x / this.bucket_width) + 2);
	  //console.log("index: " + index);
	  this.buckets[index].push(objs[idx]);
    }
  };

  this.clear = function() {
    for (idx in this.buckets) {
      this.buckets[idx].length = 0;
    }
  };



};
var bucketManager = new BucketManager(display.width, display.height);

// Returns boids in same bucket as given Point
this.getBucket = function(loc) {
  return bucketManager.buckets[(Math.floor(loc.y / bucketManager.bucket_height) + 2) * bucketManager.numBucketsX + (Math.floor((loc.x / bucketManager.bucket_width)) + 2)];
}

// Returns boids in same bucket + 8 neighboring buckets as given Point
this.getBuckets = function(loc) {
  var index = (Math.floor(loc.y / bucketManager.bucket_height) + 2) * bucketManager.numBucketsX + (Math.floor((loc.x / bucketManager.bucket_width)) + 2);
  var xIndex = index % bucketManager.numBucketsX;
  var yIndex = Math.floor(index / bucketManager.numBucketsX);
  var mBuckets = bucketManager.buckets[index];

  // left
  if(xIndex != 0) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index - 1]);

    // top
    if(yIndex != 0) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index - 1 - bucketManager.numBucketsX]);
    }

    // bottom
    if(yIndex != bucketManager.numBucketsY - 1) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index - 1 + bucketManager.numBucketsX]);
    }
  }

  // top
  if(yIndex != 0) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index - bucketManager.numBucketsX]);
  }

  // right
  if(xIndex != bucketManager.numBucketsX - 1) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index + 1]);

    // top
    if(yIndex != 0) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index + 1 - bucketManager.numBucketsX]);
    }

    // bottom
    if(yIndex != bucketManager.numBucketsY - 1) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index + 1 + bucketManager.numBucketsX]);
    }
  }

  // bottom
  if(yIndex != 0) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index + bucketManager.numBucketsX]);
  }

  return mBuckets;
};
