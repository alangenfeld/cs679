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

float unpack (vec4 colour) {
  const vec4 bitShifts = vec4(1.0 / (256.0 * 256.0 * 256.0),
			      1.0 / (256.0 * 256.0),
			      1.0 / 256.0,
			      1.0);
  return dot(colour, bitShifts);
}

void main(void) {
  vec4 col = vec4(1.0, 1.0, 1.0, 1.0);
  vec3 lightDirection = normalize(lightPos - worldPos.xyz);
  float w = max(dot(normalize(n), lightDirection), 0.0);
  float dist = length(lightPos - worldPos.xyz);
  float attenuate =  1.0 / ((attenuation.x) + 
			    (attenuation.y * dist) +
			    (attenuation.z * dist * dist));

  vec3 lighting = ambient + lightCol * w * attenuate;

  gl_FragColor = vec4(lighting, 1.0);
  
  float shadow = unpack(textureCube(shadowCube, -lightDirection.xyz));

  // far near Z translation
  vec4 lpVec = uLPMatrix * vec4(0.0, 0.0, distance(lightPos, worldPos.xyz), 1.0);
  float delta = abs(length(lpVec) - shadow);
  
  gl_FragColor = vec4(delta * col.rgb, 1.0);

  float bias = 0.003;
  if (delta > bias) {
//    gl_FragColor = vec4(0.1 * lighting.rgb, 1.0);
  }
}
