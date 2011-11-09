#ifdef GL_ES
precision highp float;
#endif
varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;
varying vec2 texCoord;

uniform vec3 lightPos;
uniform vec3 lightCol;
uniform vec3 ambient;
uniform vec3 attenuation;
uniform vec3 color;

void main(void) {
  vec4 col = vec4(color, 1.0);
  vec3 lightDirection = normalize(lightPos - worldPos.xyz);
  float w = max(dot(normalize(n), lightDirection), 0.0);
  float dist = length(lightPos - worldPos.xyz);

  float attenuate =  1.0 / ((attenuation.x) + 
			    (attenuation.y * dist) +
			    (attenuation.z * dist * dist));

  vec3 lighting = ambient + lightCol * w * attenuate;
  lighting = col.rgb * lighting;
  gl_FragColor = vec4(lighting, 1.0);
}
