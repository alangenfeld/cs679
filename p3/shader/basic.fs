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
  depth.z -= 0.0003;
  vec3 colour = vec3(0.0, 0.0, 0.0);
  float shadow = 0.0;

  // Filter
  int count = 0;
  for (int y = -1; y <= 1; ++y)
  {
    for (int x = -1; x <= 1; ++x)
    {
      vec2 offset = depth.xy + vec2(float(x) * texelSize, float(y) * texelSize);
      if ( (offset.x >= 0.0) && (offset.x <= 1.0) && (offset.y >= 0.0) && (offset.y <= 1.0) )
      {
	// Decode from RGBA to float
	shadow = unpack(texture2D(shadowMap, offset));

	if ( depth.z > shadow )
	  colour += lighting.xyz * vec3(0.1, 0.1, 0.1);
	else
	  colour += lighting.xyz;
	
	++count;
      }
    }
  }
  if ( count > 0 )
    colour /= float(count);
  else
    colour = lighting.xyz;

//  gl_FragColor = vec4(lighting, 1.0);
  gl_FragColor = vec4(colour, 1.0);
}
