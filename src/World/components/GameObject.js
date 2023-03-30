import * as THREE from "three";
import * as CANNON from "cannon-es";

export class GameObject {
    constructor(type, ...args) {
        this.args = args;
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
                // const groundBody = new Body({
                //     type: Body.STATIC,
                //     mass: 0,
                //     shape: new Plane(),
                //     initQuaternion: CANNON.quaternion.setFromEuler(
                //         -Math.PI / 2,
                //         0,
                //         0
                //     ),
                //     init
                // });
                // groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
                // groundBody.position.y = 0;
                break;
        }

        this.rb = new CANNON.Body(params);
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
