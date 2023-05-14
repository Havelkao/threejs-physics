import * as THREE from "three";
import * as CANNON from "cannon-es";

export class GameObject {
    constructor(type, ...args) {
        this.type = type;
        let materialParams = { wireframe: true };

        switch (type) {
            case "sphere":
                this.geometry = new THREE.SphereGeometry(...args);
                break;
            case "box":
                this.geometry = new THREE.BoxGeometry(...args);
                break;
            case "plane":
                this.geometry = new THREE.PlaneGeometry(...args);
                materialParams.side = THREE.DoubleSide;
                break;
        }

        this.material = new THREE.MeshBasicMaterial(materialParams);
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.transform = this.mesh;
    }

    addRigidBody(physicsWorld, args) {
        let params = {
            ...args,
            position: this.mesh.position,
        };
        switch (this.type) {
            case "box":
                const { width, height, depth } = this.geometry.parameters;
                params = {
                    ...params,
                    shape: new CANNON.Box(
                        new CANNON.Vec3(width / 2, height / 2, depth / 2)
                    ),
                };
                break;
            case "sphere":
                const { radius } = this.geometry.parameters;
                params = {
                    ...params,
                    shape: new CANNON.Sphere(radius),
                };
                break;
            case "plane":
                const quaternion = new CANNON.Quaternion();
                quaternion.setFromEuler(-Math.PI / 2, 0, 0);

                params = {
                    type: CANNON.Body.STATIC,
                    mass: 0,
                    shape: new CANNON.Plane(),
                    quaternion: quaternion,
                };
                // groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
                // groundBody.position.y = 0;
                break;
        }

        this.rb = new CANNON.Body(params);
        console.log(this.rb.position);
        physicsWorld.addBody(this.rb);
        this.transform = this.rb;
    }

    removeRigidBody() {
        this.rb = null;
        this.transform = this.mesh;
    }

    tick() {
        if (this.rb) {
            this.mesh.position.copy(this.rb.position);
            this.mesh.quaternion.copy(this.rb.quaternion);
        }
    }
}

export class Vehicle {
    constructor() {
        const chassisBody = new CANNON.Body({
            mass: 30,
            position: new CANNON.Vec3(0, 4, 0),
            shape: new CANNON.Box(new CANNON.Vec3(3, 0.5, 2)),
        });

        const centerOfMassAdjust = new CANNON.Vec3(0, -1, 0);
        const vehicle = new CANNON.RigidVehicle({
            chassisBody,
            centerOfMassAdjust: new CANNON.Vec3(0, 0, 0),
        });

        const axisWidth = 7;
        const wheelParams = [
            {
                position: new CANNON.Vec3(-5, 0, axisWidth / 2).vadd(
                    centerOfMassAdjust
                ),
                axis: new CANNON.Vec3(0, 0, 1),
            },
            {
                position: new CANNON.Vec3(-5, 0, -axisWidth / 2).vadd(
                    centerOfMassAdjust
                ),
                axis: new CANNON.Vec3(0, 0, -1),
            },
            {
                position: new CANNON.Vec3(5, 0, axisWidth / 2).vadd(
                    centerOfMassAdjust
                ),
                axis: new CANNON.Vec3(0, 0, 1),
            },
            {
                position: new CANNON.Vec3(5, 0, -axisWidth / 2).vadd(
                    centerOfMassAdjust
                ),
                axis: new CANNON.Vec3(0, 0, -1),
            },
        ];

        wheelParams.forEach((param) => {
            const wheel = new CANNON.Body({
                mass: 1,
                material: new CANNON.Material("wheel"),
                shape: new CANNON.Sphere(1.5),
                // Some damping to not spin wheels too fast
                angularDamping: 0.2,
            });
            vehicle.addWheel({
                ...param,
                body: wheel,
                direction: new CANNON.Vec3(0, -1, 0),
            });
        });

        this.body = vehicle;
    }
}

export class PlayerController {
    constructor(gameobject) {
        this.gameobject = gameobject;
    }

    add(vehicle) {
        document.addEventListener("keydown", (event) => {
            const maxSteerVal = Math.PI / 6;
            // const maxSpeed = 10;
            const maxForce = 140;

            switch (event.key) {
                case "w":
                case "ArrowUp":
                    vehicle.setWheelForce(maxForce, 2);
                    vehicle.setWheelForce(-maxForce, 3);
                    break;

                case "s":
                case "ArrowDown":
                    vehicle.setWheelForce(-maxForce / 2, 2);
                    vehicle.setWheelForce(maxForce / 2, 3);
                    break;

                case "a":
                case "ArrowLeft":
                    vehicle.setSteeringValue(maxSteerVal, 0);
                    vehicle.setSteeringValue(maxSteerVal, 1);
                    break;

                case "d":
                case "ArrowRight":
                    vehicle.setSteeringValue(-maxSteerVal, 0);
                    vehicle.setSteeringValue(-maxSteerVal, 1);
                    break;
            }
        });

        // Reset force on keyup
        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "w":
                case "ArrowUp":
                    vehicle.setWheelForce(0, 2);
                    vehicle.setWheelForce(0, 3);
                    break;

                case "s":
                case "ArrowDown":
                    vehicle.setWheelForce(0, 2);
                    vehicle.setWheelForce(0, 3);
                    break;

                case "a":
                case "ArrowLeft":
                    vehicle.setSteeringValue(0, 0);
                    vehicle.setSteeringValue(0, 1);
                    break;

                case "d":
                case "ArrowRight":
                    vehicle.setSteeringValue(0, 0);
                    vehicle.setSteeringValue(0, 1);
                    break;
            }
        });
    }
}
