precision mediump float;

varying vec3 vColor;
varying vec4 vNormal;
varying vec4 vWorldPosition;

uniform float u_time;
uniform vec2 u_plane_resolution;

#include "landscapeNoise.glsl"

vec4 sway(vec3 swayDirection, float swayAmount, float swaySpeed) {
    float phase = u_time * swaySpeed;
    return vec4(swayDirection * swayAmount * (cos(phase) + sin(phase * 3.)) / 2., 0.);
}

void main() {
    // color is a build in for vertex colors built into the grass model
    vColor = color.rgb;
    vNormal = vec4(normalize(inverse(transpose(mat3(instanceMatrix))) * vec3(normal)), 1.);
    vec4 grassPosition = instanceMatrix * vec4(position, 1.0);
    vec2 st = grassPosition.xz / u_plane_resolution;

    grassPosition += sway(normalize(vec3(3., 0., -1.)), pow(vColor.r, .71) * 10., 7.);
    grassPosition += getLandscapeNoiseOffset(st);

    vWorldPosition = projectionMatrix * modelViewMatrix * grassPosition;

    gl_Position = vWorldPosition;
}