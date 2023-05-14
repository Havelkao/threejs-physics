import { createRenderer } from "./systems/renderer";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createControls } from "./systems/controls";
import { Loop } from "./systems/Loop";
import { Resizer } from "./systems/Resizer";
import { createPhysicsWorld } from "./components/physics";
import { GameObject } from "./components/GameObject";
import { PlayerController } from "./components/PlayerController";

let camera;
let renderer;
let scene;
let loop;
let physicsWorld;
let controls;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        new Resizer(container, camera, renderer);
        physicsWorld = createPhysicsWorld();
        console.log(physicsWorld);
        GameObject.setPhysicsWorld(physicsWorld);

        // Objects
        const plane = new GameObject("plane", 1000, 1000, 50, 50);
        plane.addRigidBody({ isStatic: true });
        scene.add(plane.mesh);

        const obstacle = new GameObject("box", 1, 1, 1);
        obstacle.addRigidBody({ mass: 1 });
        obstacle.transform.position.set(0, 10, 0);
        obstacle.transform.quaternion.setFromEuler(Math.PI / 8, 0, 0);
        scene.add(obstacle.mesh);

        const car = new GameObject("box", 1, 1, 1);
        car.addRigidBody({ mass: 1 });
        car.transform.position.set(0, 10, 0);
        car.transform.quaternion.setFromEuler(Math.PI / 8, 0, 0);
        scene.add(car.mesh);
        new PlayerController().add(car.rb);

        loop = new Loop(camera, scene, renderer);
        loop.updatables.push(physicsWorld);
        loop.updatables.push(obstacle);
        loop.updatables.push(controls);
        loop.updatables.push(car);
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };
