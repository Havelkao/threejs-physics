import { createRenderer } from "./systems/renderer";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createControls } from "./systems/controls";
import { Loop } from "./systems/Loop";
import { Resizer } from "./systems/Resizer";
import { createPhysicsWorld } from "./components/physics";
import { GameObject, PlayerController, Vehicle } from "./components/GameObject";
import { Vec3 } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

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

        const cannonDebugger = new CannonDebugger(scene, physicsWorld);
        cannonDebugger.tick = cannonDebugger.update;

        // Objects
        const floor = new GameObject("plane", 1000, 1000, 50, 50);
        floor.addRigidBody(physicsWorld);
        scene.add(floor.mesh);

        const vehicle = new Vehicle();
        vehicle.body.addToWorld(physicsWorld);
        console.log(vehicle.body);
        const pc = new PlayerController();
        pc.add(vehicle.body);

        loop = new Loop(camera, scene, renderer);
        loop.updatables.push(physicsWorld);
        loop.updatables.push(floor);
        loop.updatables.push(controls);
        loop.updatables.push(cannonDebugger);
    }

    // used by Loop
    render() {
        renderer.render(scene, camera);
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };
