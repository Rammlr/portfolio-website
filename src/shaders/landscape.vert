precision mediump float;

uniform vec2 u_plane_resolution;

varying vec2 vUv;

#include "lygia/generative/pnoise.glsl"

void main() {
    vUv = uv; // this is terribly documented but uv is actually provided by three.js for built in geometries
    vec2 st = position.xz / u_plane_resolution;
    st *= 4.;

    float noise = pnoise(vec2(st), vec2(1.2, 3.4)) * 0.5;
    noise *= 150.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0., noise, 0.), 1.0);
}