import * as THREE from "three";

export type MyDirectionalLight = {
    color: THREE.Vector3,
    direction: THREE.Vector3,
}

export type MaterialProperties = {
    ka: number, // ambient coefficient
    kd: number, // diffuse coefficient
    ks: number, // specular coefficient
    alpha: number, // shininess exponent
}