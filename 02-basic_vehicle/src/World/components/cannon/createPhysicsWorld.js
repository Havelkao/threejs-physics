import { World, Material, ContactMaterial } from "cannon-es";

function createPhysicsWorld() {
    const world = new World();
    world.gravity.set(0, -9.82, 0); // m/s²

    world.material = {
        ground: new Material("ground"),
        slippery: new Material("slippery"),
    };

    const slipperyGround = new ContactMaterial(
        world.material.ground,
        world.material.slippery,
        {
            friction: 0.0001,
            restitution: 0.3, //bounciness
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
        }
    );

    world.addContactMaterial(slipperyGround);

    world.update = (delta) => {
        // world.fixedStep();
        world.step(1 / 60, delta);
    };

    return world;
}

export { createPhysicsWorld };
