import * as THREE from 'three';
import {smootherLerp} from "./util.ts";

let scrollPercent = 0;

type CameraSpot = {
    position: THREE.Vector3;
    rotation: THREE.Vector3;
}

const cameraSpots = [
    {
        position: new THREE.Vector3(-842., 102., -5.4),
        rotation: new THREE.Vector3(-1.6245, -1.45, -1.6249)
    },
    {
        position: new THREE.Vector3(-579., 90., -945.),
        rotation: new THREE.Vector3(-2.56, -0.578, -2.79)
    },
    {
        position: new THREE.Vector3(93.09224635967911, 34.608073896799965, -842.3379813880463),
        rotation: new THREE.Vector3(-3.10053001469898, 0.1099777872443879, -3.137083269245856)
    },
    {
        position: new THREE.Vector3(-0., 120., -1100.),
        rotation: new THREE.Vector3(-3.0406648221444494, 0.24398004152647734, -3.117133606045608)
    },
] as CameraSpot[];

export function addScrollControls(camera: THREE.PerspectiveCamera) {
    const initialSpot = cameraSpots[0];
    camera.position.set(initialSpot.position.x, initialSpot.position.y, initialSpot.position.z);
    camera.rotation.set(initialSpot.rotation.x, initialSpot.rotation.y, initialSpot.rotation.z);

    document.body.onscroll = () => {
        //calculate the current scroll progress (0 to 1)
        scrollPercent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight))

        const interpolatedPosition = smootherLerp(cameraSpots[0].position, cameraSpots[1].position, cameraSpots[2].position, cameraSpots[3].position, scrollPercent);
        camera.position.set(interpolatedPosition.x, interpolatedPosition.y, interpolatedPosition.z);
        const interpolatedRotation = smootherLerp(cameraSpots[0].rotation, cameraSpots[1].rotation, cameraSpots[2].rotation, cameraSpots[3].rotation, scrollPercent)
        camera.rotation.set(interpolatedRotation.x, interpolatedRotation.y, interpolatedRotation.z);
    }
}