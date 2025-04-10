import * as THREE from 'three';

export function addSanityCube(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

export function randomXZPositionMatrix(matrix: THREE.Matrix4, uniformScaleFactor: number, planeSize: number) {
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    position.x = Math.random() * planeSize - planeSize / 2.;
    position.z = Math.random() * planeSize - planeSize / 2.;
    scale.x = scale.y = scale.z = uniformScaleFactor;
    scale.y *= Math.random() * .5 + .5;

    // this removes the need for billboarding, random rotation between +-90 degrees
    const rotation = new THREE.Quaternion()
        .setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - .5) * 2. * Math.PI / 4);

    matrix.compose(position, rotation, scale);
}

export function vector3ToHexNumber(vector: THREE.Vector3): number {
    const color = new THREE.Color(vector.x, vector.y, vector.z);
    return color.getHex();
}