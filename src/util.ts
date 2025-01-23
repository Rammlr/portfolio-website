import * as THREE from 'three';

export function addSanityCube(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}