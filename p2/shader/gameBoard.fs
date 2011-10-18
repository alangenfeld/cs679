#ifdef GL_ES
precision highp float;
#endif

varying vec3 vtxPosition;

void main(void) {
  float col = 0.9;
  if(fract(vtxPosition.x) > 0.5 ^^ fract(vtxPosition.y) > 0.5) {
    col = 0.0;
  }

  gl_FragColor = vec4(col, col, col, 1.0);
}
