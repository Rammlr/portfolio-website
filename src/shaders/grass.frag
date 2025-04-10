precision mediump float;

const vec4 I_a = vec4(1.0);
const int DIRECTIONAL_LIGHT_COUNT = 2;

struct DirectionalLight {
    vec4 color;
    vec4 direction;
};

struct MaterialProperties {
    float ka; // ambient coefficient
    float kd; // diffuse coefficient
    float ks; // specular coefficient
    float alpha; // shininess exponent
};

varying vec3 vColor;
varying vec4 vNormal;
varying vec4 vWorldPosition;

uniform float u_time;
uniform MaterialProperties u_material_properties;
uniform DirectionalLight u_directional_lights[DIRECTIONAL_LIGHT_COUNT];
uniform bool u_show_normals;

vec3 extractCamPosition() {
    return vec3(inverse(viewMatrix)[3]);
}

vec4 calculatePhongIllumination(vec3 L, vec3 N, vec3 V, vec4 lightColor, vec4 objectColor) {
    float kd = u_material_properties.kd;
    float ks = u_material_properties.ks;
    float alpha = u_material_properties.alpha;

    vec3 R = normalize(reflect(-L, N));

    vec4 diffuseLighting = kd * max(dot(L, N), 0.0) * lightColor * objectColor;
    // NOTE: only the light color is used for specular highlights (makes sense when you consider what a specular highlight is)
    vec4 specularLighting = ks * pow(max(dot(R, V), 0.0), alpha) * lightColor;

    return diffuseLighting + specularLighting;
}

vec4 calculateDirectionalLight(vec3 worldPosition, vec3 N, vec3 camPosition, DirectionalLight directionalLight, vec4 objectColor) {
    // Vector from this vertex to the light source is just -direction vector
    vec3 L = normalize(-directionalLight.direction.xyz);
    vec3 V = normalize(camPosition - worldPosition);
    vec4 lightColor = directionalLight.color;

    return calculatePhongIllumination(L, N, V, lightColor, objectColor);
}

vec4 calculateLighting(vec4 objectColor) {
    vec3 cam_pos = extractCamPosition();
    vec3 N = vNormal.xyz;
    float ka = u_material_properties.ka;

    vec4 I = ka * I_a * objectColor;

    for (int i = 0; i < DIRECTIONAL_LIGHT_COUNT; i++) {
        // dividing by the count here is a cheap hack to make the scene not overly bright,
        // usually this should be done within the light properties or in some other way
        I += calculateDirectionalLight(vWorldPosition.xyz, N, cam_pos, u_directional_lights[i], objectColor) / float(DIRECTIONAL_LIGHT_COUNT);
    }

    return I;
}

void main() {
    vec3 green = vec3(0., 255., 0.) / 255.;
    vec4 objectColor = vec4(mix(green, vec3(1.), vColor), 1.0);

    vec4 I = calculateLighting(objectColor);

    gl_FragColor = I;
    if (u_show_normals) {
        gl_FragColor = vNormal;
    }
}