function Particle(posX, posY, spd) {
  this.posX = posX;
  this.posY = posY;
  this.speed = spd;
  
  this.offset = vec3.create(
    [0,0,0]
  );

  this.dir = vec3.create(
    [Math.random()-.5,
    Math.random()-.5,
    Math.random()-.5]
  );
  vec3.normalize(this.dir);

  this.colorV = [1.0,0.6,0];

  this.shader = getShader("shape");
  setAttribute(this, 
	       {name: "vtx",
		content: [
		  -0.1, 0.0, 0.1,
		  -0.1, 0.0, -0.1,
		  0.1, 0.0, 0.1,

		  0.1, 0.0, 0.1,
		  0.1, 0.0, -0.1,
		  -0.1, 0.0, -0.1
		]});
  this.attributes = ["vtx"];
  this.attributes.size = 6;
  this.shader.color = gl.getUniformLocation(this.shader, "color");
  
  this.init();

  this.update = function() {
    var temp = vec3.create();
    vec3.scale(this.dir, this.speed, temp);
    vec3.add(this.offset, temp);
  };

  this.draw = function() {
    mvPushMatrix();
    
    mat4.translate(mvMatrix, [this.posX/2.0, this.posY/2.0, .25]);
    mat4.scale(mvMatrix, [0.25, 0.25, 0.25]);
    mat4.translate(mvMatrix, [1.0, 1.0, 0.0]);
    mat4.translate(mvMatrix, this.offset);


    gl.useProgram(this.shader);
    
    gl.uniform3fv(this.shader.color, this.colorV);
    bindAttributes(this);
    
    setMatrixUniforms(this.shader);
    
    gl.drawArrays(gl.TRIANGLES, 0, this.attributes.size);
    mvPopMatrix();
  };
}
Particle.prototype = new GameObject;

function ParticleEmitter(x, y, n, life, spd) {
  this.particles = new Array();
  this.lifetime = life;

  for(var i=0; i < n; i++) {
    this.particles.push(new Particle(x, y, spd));
  }

  this.init();

  this.update = function() {
    this.lifetime--;
    if (this.lifetime <= 0) {
      for(var i in this.particles) {
	this.particles[i].shutdown();
      }
      this.shutdown();      
    }
  };
}
ParticleEmitter.prototype = new GameObject;
