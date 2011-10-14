#ifdef GL_ES
precision highp float;
#endif

varying vec3 vtxPosition;

void main(void) {
  float col = 0.0;
  if (int(floor(vtxPosition.x) + floor(vtxPosition.y)) / 2 == 1) {
    float col = 0.8;
  }

  gl_FragColor = vec4(col, col, col, 1.0);
}
