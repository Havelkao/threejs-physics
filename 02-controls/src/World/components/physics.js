import { World } from "cannon-es";

function createPhysicsWorld() {
    const world = new World();
    world.gravity.set(0, -9.82, 0); // m/s²
    // world.defaultContactMaterial.friction = 0;

    world.update = (delta) => {
        // world.fixedStep();
        world.step(1 / 60, delta);
    };

    return world;
}

export { createPhysicsWorld };
