import * as THREE from "three";
import * as CANNON from "cannon-es";

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
    }

    start() {}

    update() {
        if (this.rb) {
            this.mesh.position.copy(this.rb.position);
            this.mesh.quaternion.copy(this.rb.quaternion);
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

        switch (this.type) {
            case "box":
                params = {
                    ...params,
                    shape: new CANNON.Box(
                        new CANNON.Vec3(
                            geometry.width / 2,
                            geometry.height / 2,
                            geometry.depth / 2
                        )
                    ),
                };
                break;
            case "sphere":
                params = {
                    ...params,
                    shape: new CANNON.Sphere(geometry.radius),
                };
                break;
            case "plane":
                const quaternion = new CANNON.Quaternion();
                quaternion.setFromEuler(-Math.PI / 2, 0, 0); // rotate horizontally

                params = {
                    type: CANNON.Body.STATIC,
                    mass: 0,
                    shape: new CANNON.Plane(),
                    quaternion: quaternion,
                };
                break;
            case "cylinder":
                const q = new CANNON.Quaternion();
                q.setFromEuler(-Math.PI, 0, 0); // rotate horizontally

                params = {
                    ...params,
                    shape: new CANNON.Cylinder(
                        geometry.radiusTop,
                        geometry.radiusBottom,
                        geometry.height,
                        geometry.radialSegments
                    ),

                    quaternion: q,
                };
                break;
        }

        this.rb = new CANNON.Body(params);
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
