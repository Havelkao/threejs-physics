import { PerspectiveCamera } from "three";

function createCamera(
    fov = 90,
    ar = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 1000
) {
    const camera = new PerspectiveCamera(fov, ar, near, far);
    const position = 10;
    camera.position.set(position, position, position);

    return camera;
}

export { createCamera };
