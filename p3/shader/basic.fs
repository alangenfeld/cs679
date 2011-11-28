#ifdef GL_ES
precision highp float;
#endif

varying vec4 worldPos;
varying vec3 n;

uniform vec3 lightPos;
uniform vec3 lightCol;
uniform vec3 ambient;
uniform vec3 attenuation;

uniform sampler2D shadowMap[5];
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
  
  float bias = 0.003;

  float shadow = unpack(textureCube(shadowCube, -lightDirection.xyz));

  if (lightDirection.z - bias - shadow > 0.0) {
    gl_FragColor = vec4(0.1 * lighting.xyz, 1.0);
  }
}

/**
  for (int i=0; i<5; i++) {
    vec3 depth = litPos[i].xyz / litPos[i].w;
    float delta = 0.003;
    depth.z -= delta;
    float shadow = 0.0;
    
    if ( (depth.x >= 0.0) && (depth.x <= 1.0) && (depth.y >= 0.0) && (depth.y <= 1.0)) {
      shadow = unpack(texture2D(shadowMap[i], depth.xy));
      
      if ( depth.z > shadow) {
	gl_FragColor = vec4(0.1 * lighting.xyz, 1.0);
      }
    }
  }
}

*/
