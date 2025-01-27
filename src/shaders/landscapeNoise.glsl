precision mediump float;

#include "lygia/generative/pnoise.glsl"

vec4 getLandscapeNoiseOffset(vec2 st) {
    float noise = pnoise(st * 4., vec2(1.2, 3.4)) * 0.5;
    noise *= 150.;
    return vec4(0., noise, 0., 0.);
}