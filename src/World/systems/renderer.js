import { WebGLRenderer } from "three";

function createRenderer(width, height) {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(width || window.innerWidth, height || window.innerHeight);

    return renderer;
}

export { createRenderer };