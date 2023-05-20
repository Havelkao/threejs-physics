import * as THREE from "three";
import * as CANNON from "cannon-es";

// maybe use https://github.com/donmccurdy/three-to-cannon

export class GameObject {
    constructor(type, ...args) {
        this.physicsWorld = GameObject.physicsWorld;
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
            case "cylinder":
                this.geometry = new THREE.CylinderGeometry(...args);
                break;
        }

        this.material = new THREE.MeshBasicMaterial(materialParams);
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.transform = this.mesh;

        this.start();
    }

    start() {
        // if (!this.rb) return;

        this.shapeWorldPosition = new CANNON.Vec3();
        this.shapeWorldQuaternion = new CANNON.Quaternion();
    }

    update() {
        if (this.rb) {
            // https://github.com/pmndrs/cannon-es-debugger/blob/master/src/cannon-es-debugger.ts
            this.rb.quaternion.vmult(
                this.rb.shapeOffsets[0],
                this.shapeWorldPosition
            );
            this.rb.position.vadd(
                this.shapeWorldPosition,
                this.shapeWorldPosition
            );
            this.rb.quaternion.mult(
                this.rb.shapeOrientations[0],
                this.shapeWorldQuaternion
            );

            this.mesh.position.copy(this.shapeWorldPosition);
            this.mesh.quaternion.copy(this.shapeWorldQuaternion);
        }
    }

    addRigidBody(args) {
        const physicsWorld = args?.physicsWorld || GameObject.physicsWorld;
        if (!physicsWorld) {
            console.error("No physics world specifed");
            return;
        }

        let params = {
            ...args,
            position: this.mesh.position,
        };
        const geometry = this.geometry.parameters;
        let shape = args?.shape;
        let orientation = args?.orientation;
        let offset = args?.offset;

        switch (this.type) {
            case "box":
                shape = new CANNON.Box(
                    new CANNON.Vec3(
                        geometry.width / 2,
                        geometry.height / 2,
                        geometry.depth / 2
                    )
                );
                break;

            case "sphere":
                shape = new CANNON.Sphere(geometry.radius);
                break;

            case "plane":
                const quaternion = new CANNON.Quaternion();
                quaternion.setFromEuler(-Math.PI / 2, 0, 0); // rotate horizontally
                params = {
                    type: CANNON.Body.STATIC,
                    mass: 0,
                    quaternion: quaternion,
                };
                shape = new CANNON.Plane();
                break;

            case "cylinder":
                shape = new CANNON.Cylinder(
                    geometry.radiusTop,
                    geometry.radiusBottom,
                    geometry.height,
                    geometry.radialSegments
                );
                break;
        }

        this.rb = new CANNON.Body(params);
        this.rb.addShape(shape, offset, orientation);

        physicsWorld.addBody(this.rb);
        this.transform = this.rb;

        // make this.addRigidBody usable both before and after setting transform position
        this.mesh.position.set(undefined);
        if (params.type == CANNON.Body.STATIC) {
            this.update();
        }
    }

    removeRigidBody() {
        this.rb = null;
        this.transform = this.mesh;
    }

    static setPhysicsWorld(physicsWorld) {
        GameObject.physicsWorld = physicsWorld;
    }
}
