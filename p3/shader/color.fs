#ifdef GL_ES
precision highp float;
#endif

varying vec4 worldPos;
varying vec3 n;

uniform vec3 baseColor;
uniform vec3 lightPos;
uniform vec3 lightCol;
uniform vec3 ambient;
uniform vec3 attenuation;

void main(void) {
  vec4 col = vec4(baseColor.rgb, 1.0);
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
