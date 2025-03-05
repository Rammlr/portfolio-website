precision mediump float;

const vec4 I_a = vec4(1.0);

struct DirectionalLight {
    vec4 color;
    vec4 direction;
};

varying vec3 vColor;
varying vec4 vNormal;
varying vec4 vWorldPosition;

uniform float u_time;
uniform vec4 u_material_properties;
uniform DirectionalLight u_directional_light;
uniform bool u_show_normals;

vec3 extractCamPosition() {
    return vec3(inverse(viewMatrix)[3]);
}

vec4 calculatePhongIllumination(vec3 L, vec3 N, vec3 V, vec4 lightColor, vec4 objectColor) {
    float kd = u_material_properties.y;
    float ks = u_material_properties.z;
    float alpha = u_material_properties.w;

    vec3 R = normalize(reflect(-L, N));

    vec4 diffuseLighting = kd * max(dot(L, N), 0.0) * lightColor * objectColor;
    // NOTE: only the light color is used for specular highlights (makes sense when you consider what a specular highlight is)
    vec4 specularLighting = ks * pow(max(dot(R, V), 0.0), alpha) * lightColor;

    return diffuseLighting + specularLighting;
}

vec4 calculateDirectionalLight(vec3 worldPosition, vec3 N, vec3 camPosition, vec4 objectColor) {
    // Vector from this vertex to the light source is just -direction vector
    vec3 L = normalize(-u_directional_light.direction.xyz);
    vec3 V = normalize(camPosition - worldPosition);
    vec4 lightColor = u_directional_light.color;

    return calculatePhongIllumination(L, N, V, lightColor, objectColor);
}

vec4 calculateLighting(vec4 objectColor) {
    vec3 cam_pos = extractCamPosition();
    vec3 N = vNormal.xyz;
    float ka = u_material_properties.x;

    vec4 I = ka * I_a * objectColor;

    I += calculateDirectionalLight(vWorldPosition.xyz, N, cam_pos, objectColor);

    return I;
}

void main() {
    vec3 green = vec3(0., 255., 0.) / 255.;
    //    vec3 brown = vec3(92., 64., 51.) / 255.;
    vec4 objectColor = vec4(mix(green, vec3(1.), vColor), 1.0);

    vec4 I = calculateLighting(objectColor);

    gl_FragColor = I;
    if (u_show_normals) {
        gl_FragColor = vNormal;
    }
}