import { createRenderer } from "./systems/renderer";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createControls } from "./systems/controls";
import { Loop } from "./systems/Loop";
import { Resizer } from "./systems/Resizer";
import { createPhysicsWorld } from "./components/physics";
import { GameObject } from "./components/GameObject";
import { Vec3 } from "cannon-es";

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

        // Objects
        const platform1 = new GameObject("box", 7, 0.1, 7);
        platform1.addRigidBody(physicsWorld);
        platform1.transform.position.set(0, -3, -6);
        platform1.transform.quaternion.setFromEuler(Math.PI / 6, 0, 0);
        scene.add(platform1.mesh);

        const platform2 = new GameObject("box", 7, 0.1, 7);
        platform2.addRigidBody(physicsWorld);
        platform2.transform.position.y = 3;
        platform2.transform.quaternion.setFromEuler(-Math.PI / 6, 0, 0);
        scene.add(platform2.mesh);

        const platform3 = new GameObject("box", 7, 0.1, 7);
        platform3.addRigidBody(physicsWorld);
        platform3.transform.position.set(0, -8, 0);
        platform3.transform.quaternion.setFromEuler(-Math.PI / 6, 0, 0);
        scene.add(platform3.mesh);

        let sphereCount = 100;
        let spheres = [];
        for (let i = 0; i < sphereCount; i++) {
            const sphere = new GameObject("sphere", 0.25);
            sphere.addRigidBody(physicsWorld, { mass: 20 });
            sphere.transform.position.x = (Math.random() * 2 - 1) * 2.5;
            sphere.transform.position.y = 3 + Math.random() * 20;
            sphere.transform.position.z = (Math.random() * 2 - 1) * 2.5;
            scene.add(sphere.mesh);
            spheres.push(sphere);
        }

        // spawn manager??
        setInterval(() => {
            const offLedge = spheres.filter(
                (sphere) => sphere.transform.position.y < -10
            );
            if (offLedge.length === 0) return;
            const index = Math.floor(Math.random() * offLedge.length);
            const sphere = offLedge[index];
            sphere.rb.position.set(0, 10 + Math.random() * 10, 0);
            sphere.rb.velocity = new Vec3(0, 0, 0);
        }, 100);

        loop = new Loop(camera, scene, renderer);
        loop.updatables.push(physicsWorld);
        loop.updatables.push(platform1);
        loop.updatables.push(platform2);
        loop.updatables.push(platform3);
        loop.updatables.push(...spheres);
        loop.updatables.push(controls);
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
