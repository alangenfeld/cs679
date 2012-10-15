#ifdef GL_ES
precision highp float;
#endif

varying vec3 modelPos;
varying vec4 worldPos;
varying vec3 n;
varying vec4 l;

uniform vec3 lightCol;
uniform vec3 ambient;
uniform vec3 color;
uniform float hp;

void main(void) {
  vec3 lightDirection = normalize(l.xyz - worldPos.xyz);
  float w = max(dot(normalize(n), lightDirection), 0.0);
  vec3 lighting = ambient + lightCol * w;

  if (modelPos.z < hp*2.0) {
    lighting = color * lighting;
    gl_FragColor = vec4(lighting, 1.0);
  } else {
    lighting = vec3(1,1,1) * lighting;
    gl_FragColor = vec4(lighting, 1.0);
  }
}

