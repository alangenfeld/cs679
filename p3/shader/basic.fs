#ifdef GL_ES
precision highp float;
#endif

varying vec4 litPos;
varying vec4 worldPos;
varying vec3 n;

uniform vec3 lightPos;
uniform vec3 lightCol;
uniform vec3 ambient;
uniform vec3 attenuation;

uniform sampler2D shadowMap;

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

  float texelSize = 1.0 / 512.0;
  vec3 depth = litPos.xyz / litPos.w;
  float delta = 0.0003;
  depth.z -= delta;
  float shadow = 0.0;

  if ( (depth.x >= 0.0) && (depth.x <= 1.0) && (depth.y >= 0.0) && (depth.y <= 1.0) ) {
    shadow = unpack(texture2D(shadowMap, depth.xy));
  
    if ( depth.z > shadow )
      lighting = 0.1 * lighting.xyz;
  }

  gl_FragColor = vec4(lighting, 1.0);
}
