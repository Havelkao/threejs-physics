import { createRenderer } from "./systems/renderer";
import { createCamera } from "./components/three/camera";
import { createScene } from "./components/three/scene";
import { Loop } from "./systems/Loop";
import { Resizer } from "./systems/Resizer";
import { createPhysicsWorld } from "./components/cannon/createPhysicsWorld";
import { GameObject } from "./components/cannon/GameObject";
import { PlayerController } from "./components/cannon/PlayerController";
import { ThirdPersonCamera } from "./components/three/ThirdPersonCamera";
import { RaycastVehicle } from "./components/cannon/RaycastVehicle";
import { createTrack } from "./components/three/createTrack";

let camera;
let renderer;
let scene;
let loop;
let physicsWorld;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement);
        new Resizer(container, camera, renderer);

        physicsWorld = createPhysicsWorld();
        GameObject.setPhysicsWorld(physicsWorld);

        // Objects
        const floor = new GameObject("plane", 1000, 1000, 50, 50);
        floor.addRigidBody();
        // scene.add(floor.mesh);

        const vehicle = new RaycastVehicle();
        vehicle.addToWorld();
        scene.add(...vehicle.meshes);

        new PlayerController(vehicle.body, container);
        const thirdPersonCamera = new ThirdPersonCamera(
            vehicle.body.chassisBody,
            camera
        );

        // track
        const track = createTrack();
        scene.add(track);

        //  loop
        loop = new Loop(camera, scene, renderer);
        loop.updatables.push(physicsWorld);
        loop.updatables.push(thirdPersonCamera);
        loop.updatables.push(...vehicle.components);
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
