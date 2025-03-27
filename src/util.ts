import * as THREE from 'three';

export function addSanityCube(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

export function randomXZPositionMatrix(matrix: THREE.Matrix4, uniformScaleFactor: number, planeSize: number): THREE.Matrix4 {
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    position.x = Math.random() * planeSize - planeSize / 2.;
    position.z = Math.random() * planeSize - planeSize / 2.;
    scale.x = scale.y = scale.z = uniformScaleFactor;
    scale.y *= Math.random() * .5 + .5;

    // this removes the need for billboarding
    // TODO: this fucks the normals somehow
    const rotation = new THREE.Quaternion()
        .setFromAxisAngle(new THREE.Vector3(0, Math.random(), 0), Math.PI / 4);

    return matrix.compose(position, rotation, scale);
}