import * as CANNON from "cannon-es";
import { GameObject } from "./GameObject";

export class RaycastVehicle {
    constructor(physicsWorld) {
        this.world = physicsWorld || GameObject.physicsWorld;
        this.components = [];

        const chassisBodyGO = new GameObject("box", 4, 1, 2);
        chassisBodyGO.addRigidBody({ mass: 150 });
        chassisBodyGO.transform.position.set(0, 4, 0);
        chassisBodyGO.transform.angularVelocity.set(0, 0.5, 0);
        this.components.push(chassisBodyGO);

        const vehicle = new CANNON.RaycastVehicle({
            chassisBody: chassisBodyGO.rb,
        });

        const wheelOptions = {
            radius: 0.5,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 30,
            suspensionRestLength: 0.3,
            frictionSlip: 1.4,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(0, 0, 1),
            chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true,
        };

        wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1);
        vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(-1, 0, -1);
        vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(1, 0, 1);
        vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(1, 0, -1);
        vehicle.addWheel(wheelOptions);

        const wheelBodies = [];
        const wheelMaterial = new CANNON.Material("wheel");
        vehicle.wheelInfos.forEach((wheel) => {
            const c = new GameObject(
                "cylinder",
                wheel.radius,
                wheel.radius,
                wheel.radius / 2,
                20
            );
            c.mesh.rotateX(-Math.PI / 2);

            c.addRigidBody({
                mass: 0,
                material: wheelMaterial,
                type: CANNON.Body.KINEMATIC,
                collisionFilterGroup: 0,
                orientation: new CANNON.Quaternion().setFromEuler(
                    -Math.PI / 2,
                    0,
                    0
                ),
            });

            wheelBodies.push(c.rb);
            this.components.push(c);
        });

        this.world.addEventListener("postStep", () => {
            for (let i = 0; i < vehicle.wheelInfos.length; i++) {
                vehicle.updateWheelTransform(i);
                const transform = vehicle.wheelInfos[i].worldTransform;
                const wheelBody = wheelBodies[i];
                wheelBody.position.copy(transform.position);
                wheelBody.quaternion.copy(transform.quaternion);
            }
        });

        this.body = vehicle;
        this.meshes = this.components.map((component) => component.mesh);
    }

    addToWorld() {
        this.body.addToWorld(this.world);
    }
}
