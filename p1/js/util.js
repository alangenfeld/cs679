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

  this.angle = function() {
    var rad = Math.atan2(this.y, this.x);

	if(rad > 0) {
      return 180*(rad / Math.PI);
    } else {
      return 180*(rad / Math.PI) + 360;
	}
  };
  
  this.inverse = function() {
    this.x = -this.x;
    this.y = -this.y;
  };
}

function averageVectors(initialDir, vectors, mag) {
  var x = 0;
  var y = 0;

  for (idx in vectors) {
    x += vectors[idx].x;
    y += vectors[idx].y;
  }
  x /= vectors.length;
  y /= vectors.length;
  return new Vector((initialDir.x + x)/2, (initialDir.y + y)/2, mag);
}

/*
function limitAngle(initialDir, finalDir, limit) {
  var angle1 = initialDir.angle();
  var angle2 = finalDir.angle();

  if(angle1 < 90 && angle2 > 270) {
    angle2 -= 360;
  }

  var diff = Math.abs(angle1 - angle2);
  if(diff > limit) {
    var mag = Math.floor(diff/limit);
	return new Vector((mag*initialDir.x + finalDir.x)/(mag+1), (mag*initialDir.y + finalDir.y)/(mag+1), initialDir.mag);
  }

  return finalDir;
}
*/

/**
 * Spatial Bucket Manager
 *
 *  - buckets start at 0, -100
 *  - bucket size of 50x50
 */
function BucketManager(width, height) {
  this.width = width;
  this.height = height + 100;

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
    for (idx in objs) {
      var index = getBucketIndex(objs[idx].loc);

      // add to new bucket
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

this.getBucketIndex = function(loc) {
  var indexX = Math.floor(loc.x / bucketManager.bucket_width);
  var indexY = Math.floor(loc.y / bucketManager.bucket_height) + 2;

  if(indexY < 0) {
    indexY = 0;
  } else if(indexY > bucketManager.numBucketsY - 1) {
    indexY = bucketManager.numBucketsY - 1;
  }

  if(indexX < 0) {
    indexX = 0;
  } else if(indexX > bucketManager.numBucketsX - 1) {
    indexX = bucketManager.numBucketsX - 1;
  }

  return indexY * bucketManager.numBucketsX + indexX;
}

// Returns boids in same bucket as given Point
this.getBucket = function(loc) {
  var index = getBucketIndex(loc);

  return bucketManager.buckets[index];
}

// Returns boids in same bucket + 8 neighboring buckets as given Point
this.getBuckets = function(loc) {
  var indexX = Math.floor(loc.x / bucketManager.bucket_width);
  var indexY = Math.floor(loc.y / bucketManager.bucket_height) + 2;

  if(indexY < 0) {
    indexY = 0;
  } else if(indexY > bucketManager.numBucketsY - 1) {
    indexY = bucketManager.numBucketsY - 1;
  }

  if(indexX < 0) {
    indexX = 0;
  } else if(indexX > bucketManager.numBucketsX - 1) {
    indexX = bucketManager.numBucketsX - 1;
  }

  var index = indexY * bucketManager.numBucketsX + indexX;
  var mBuckets = bucketManager.buckets[index];

  // left
  if(indexX != 0) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index - 1]);

    // top
    if(indexY != 0) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index - 1 - bucketManager.numBucketsX]);
    }

    // bottom
    if(indexY != bucketManager.numBucketsY - 1) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index - 1 + bucketManager.numBucketsX]);
    }
  }

  // top
  if(indexY != 0) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index - bucketManager.numBucketsX]);
  }

  // right
  if(indexX != bucketManager.numBucketsX - 1) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index + 1]);

    // top
    if(indexY != 0) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index + 1 - bucketManager.numBucketsX]);
    }

    // bottom
    if(indexY != bucketManager.numBucketsY - 1) {
      mBuckets = mBuckets.concat(bucketManager.buckets[index + 1 + bucketManager.numBucketsX]);
    }
  }

  // bottom
  if(indexY != bucketManager.numBucketsY - 1) {
    mBuckets = mBuckets.concat(bucketManager.buckets[index + bucketManager.numBucketsX]);
  }

  return mBuckets;
};
