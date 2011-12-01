#ifdef GL_ES
precision highp float;
#endif

varying vec4 worldPos;
varying vec3 n;

uniform mat4 uLPMatrix;

uniform vec3 lightPos;
uniform vec3 lightCol;
uniform vec3 ambient;
uniform vec3 attenuation;

uniform samplerCube shadowCube;

float unpack2 (vec4 colour) {
  return colour.r * 256.0 + colour.g + colour.b / 256.0 + colour.a / (256.0 * 256.0);
}

void main(void) {
  vec4 col = vec4(1.0, 1.0, 1.0, 1.0);
  vec3 lightDirection = lightPos - worldPos.xyz;
  float w = max(dot(normalize(n), normalize(lightDirection)), 0.0);
  float dist = length(lightDirection);
  float attenuate =  1.0 / ((attenuation.x) + 
			    (attenuation.y * dist) +
			    (attenuation.z * dist * dist));

  vec3 lighting = ambient + lightCol * w * attenuate;
  lighting = col.rgb * lighting;

  vec4 sample = textureCube(shadowCube, -lightDirection.xyz);
  float shadow = unpack2(sample);
  float delta = shadow - dist;
  float bias = 1.0;
  
  float visibility  = ((shadow - dist) > -bias) ? (1.0) : (0.2);

  gl_FragColor = vec4(visibility * lighting, 1.0);

}
