import { createRenderer } from "./systems/renderer";
import { createCamera } from "./components/three/camera";
import { createScene } from "./components/three/scene";
import { Loop } from "./systems/Loop";
import { Resizer } from "./systems/Resizer";
import { createPhysicsWorld } from "./components/cannon/createPhysicsWorld";
import { GameObject } from "./components/cannon/GameObject";
import { PlayerController } from "./components/cannon/PlayerController";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { ThirdPersonCamera } from "./components/three/ThirdPersonCamera";

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
        const plane = new GameObject("plane", 1000, 1000, 50, 50);
        plane.addRigidBody({ isStatic: true });
        plane.rb.material = physicsWorld.material.ground;
        scene.add(plane.mesh);

        const obstacleCount = 100;
        const obstacles = [];
        for (let i = 0; i < obstacleCount; i++) {
            const obstacle = new GameObject("box", 1, 1, 1);
            obstacle.addRigidBody({ mass: 0.1 });
            const size = 10;
            obstacle.transform.position.set(
                i % size,
                3,
                Math.floor(i / size) * 5
            );
            scene.add(obstacle.mesh);
            obstacles.push(obstacle);
        }

        const car = new GameObject("box", 1, 1, 2);
        car.addRigidBody({ mass: 100 });
        car.rb.material = physicsWorld.material.slippery;
        car.rb.linearDamping = 0.3;
        car.transform.position.set(5, 5, -10);
        scene.add(car.mesh);
        new PlayerController(car, container);

        var helper = new THREE.AxesHelper();
        car.mesh.add(helper);

        const thirdPersonCamera = new ThirdPersonCamera(car, camera);

        loop = new Loop(camera, scene, renderer);
        loop.updatables.push(physicsWorld);
        loop.updatables.push(thirdPersonCamera);
        loop.updatables.push(...obstacles);
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
