import * as CANNON from "cannon-es";
import { GameObject } from "./GameObject";

export class RigidVehicle {
    constructor() {
        this.components = [];

        const chassisBodyGO = new GameObject("box", 6, 1, 4);
        chassisBodyGO.addRigidBody({ mass: 30 });
        chassisBodyGO.transform.position.set(0, 4, 0);
        this.components.push(chassisBodyGO);

        const centerOfMassAdjust = new CANNON.Vec3(0, -1, 0);
        const vehicle = new CANNON.RigidVehicle({
            chassisBody: chassisBodyGO.rb,
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
            const wheel = new GameObject("sphere", 1.5);
            wheel.addRigidBody({
                mass: 1,
                material: new CANNON.Material("wheel"),
                angularDamping: 0.2,
            });
            this.components.push(wheel);

            vehicle.addWheel({
                ...param,
                body: wheel.rb,
                direction: new CANNON.Vec3(0, -1, 0),
            });
        });

        this.body = vehicle;
        this.meshes = this.components.map((component) => component.mesh);
    }

    addToWorld() {
        this.body.addToWorld(GameObject.physicsWorld);
    }
}
