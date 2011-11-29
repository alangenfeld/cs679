#ifdef GL_ES
precision highp float;
#endif
  
varying vec4 worldDist;

vec4 pack (float depth)
{
  const vec4 bitSh = vec4(256 * 256 * 256,
			  256 * 256,
			  256,
			  1.0);
  const vec4 bitMsk = vec4(0,
			   1.0 / 256.0,
			   1.0 / 256.0,
			   1.0 / 256.0);
  vec4 comp = fract(depth * bitSh);
  comp -= comp.xxyz * bitMsk;
  return comp;
}

void main (void)
{
  // Encode depth to RGBA texture
  gl_FragColor = pack(gl_FragCoord.z);
}
