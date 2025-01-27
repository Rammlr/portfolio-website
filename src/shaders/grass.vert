precision mediump float;

varying vec3 vColor;

uniform float u_time;
uniform vec2 u_plane_resolution;

#include "landscapeNoise.glsl"

vec4 sway(vec4 position, vec3 swayDirection, float swayAmount, float swaySpeed) {
    return position + vec4(swayDirection * swayAmount * (cos(u_time * swaySpeed) + sin(u_time * swaySpeed * 3.)) / 2., 0.);
}

void main() {
    // color is a build in for vertex colors built into the grass model
    vColor = color.rgb;
    vec4 grassPosition = instanceMatrix * vec4(position, 1.0);
    vec2 st = grassPosition.xz / u_plane_resolution;

    grassPosition += sway(grassPosition, normalize(vec3(3., 0., -1.)), pow(vColor.r, .71) * 65., 7.);
    grassPosition += getLandscapeNoiseOffset(st) * 2.; // honestly dunno why we need * 2 here

    gl_Position = projectionMatrix * modelViewMatrix * grassPosition;
}