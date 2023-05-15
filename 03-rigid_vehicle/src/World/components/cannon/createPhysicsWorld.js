import { World, Body, Plane } from "cannon-es";

function createPhysicsWorld() {
    const world = new World();
    world.gravity.set(0, -9.82, 0); // m/s²

    world.update = (delta) => {
        // world.fixedStep();
        world.step(1 / 60, delta);
    };

    return world;
}

function createStaticPlane() {
    const groundBody = new Body({
        type: Body.STATIC,
        mass: 0,
        shape: new Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
    groundBody.position.y = 0;

    return groundBody;
}

export { createPhysicsWorld, createStaticPlane };
