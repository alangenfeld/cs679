#ifdef GL_ES
precision highp float;
#endif

varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;

uniform vec3 lightPos;
uniform vec3 lightCol;
uniform vec3 ambient;

//temp
void main(void) {
  float col = 0.8;
  vec3 lightDirection = normalize(lightPos - worldPos.xyz);
  float w = max(dot(normalize(n), lightDirection), 0.0);
  float dist = length(lightPos - worldPos.xyz);
  vec3 lighting = ambient + lightCol * w;
  float attenuation = (1.0/(dist));
  lighting = col * attenuation * lighting;
  gl_FragColor = vec4(lighting, 1.0);
}
