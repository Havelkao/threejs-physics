import * as THREE from "three";

export function createTrack() {
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
    });

    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 5), // curve magic?
        new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(0, 10, 10),
        new THREE.Vector3(0, 10, 0),
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, -10, -10),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(0, 0, 0),
    ]);
    let tubeGeometry = new THREE.TubeGeometry(curve, 50, 1.5, 2, false);

    let mesh = new THREE.Mesh(tubeGeometry, material);
    const scalar = 20;
    mesh.scale.set(scalar, scalar, scalar);
    mesh.rotateZ(-Math.PI / 2);

    return mesh;
}
