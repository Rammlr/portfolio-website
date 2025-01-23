import * as THREE from 'three';

export function createLighting(scene: THREE.Scene) {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
    scene.add(hemiLight);
    const light = new THREE.PointLight(0xff0000, 100000, 0);
    light.position.set(20, 50, 0);
    scene.add(light);
}