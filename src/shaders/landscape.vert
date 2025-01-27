precision mediump float;

uniform vec2 u_plane_resolution;

varying vec2 vUv;

#include "landscapeNoise.glsl"

void main() {
    vUv = uv; // this is terribly documented but uv is actually provided by three.js for built in geometries
    vec2 st = position.xz / u_plane_resolution;

    vec3 noiseOffset = getLandscapeNoiseOffset(st).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + noiseOffset, 1.0);
}