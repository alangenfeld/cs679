#ifdef GL_ES
precision highp float;
#endif

varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;
varying vec4 l;


uniform vec3 lightCol;
uniform vec3 ambient;

void main(void) {
  float col = 1.0;
  if(fract(modelPos.x) > 0.5 ^^ fract(modelPos.y) > 0.5) {
    col = 0.0;
  }

  vec3 lightDirection = normalize(l.xyz - worldPos.xyz);
  float w = max(dot(normalize(n), lightDirection), 0.0);
  vec3 lighting = ambient + lightCol * w;
  lighting = col * lighting;
  gl_FragColor = vec4(lighting, 1.0);
}
