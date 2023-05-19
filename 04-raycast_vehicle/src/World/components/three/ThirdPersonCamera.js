import * as THREE from "three";

export class ThirdPersonCamera {
    constructor(target, camera) {
        this.camera = camera;
        this.target = target;
        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();
    }

    _calculatePosition(x, y, z) {
        const offset = new THREE.Vector3(x, y, z);
        offset.applyQuaternion(this.target.quaternion);
        offset.add(this.target.position);

        return offset;
    }

    update(delta) {
        const offset = this._calculatePosition(15, 7, 0);
        const lookAt = this._calculatePosition(-15, 5, 0);

        // https://www.youtube.com/watch?v=UuNPHOJ_V5o
        // const t = 0.05;
        // const t = 4.0 * timeElapsed;
        const t = 1.0 - Math.pow(0.001, delta);
        this.currentPosition.lerp(offset, t);
        this.currentLookat.lerp(lookAt, t);

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookat);
    }
}
