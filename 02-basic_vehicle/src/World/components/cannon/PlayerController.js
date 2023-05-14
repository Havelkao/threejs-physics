import * as CANNON from "cannon-es";

export class PlayerController {
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.input = new PlayerInput();

        const _update = gameObject.update;

        gameObject.update = () => {
            const vehicle = this.gameObject.rb;

            const strengthForward = 500;
            const strenghtSideways = 100;

            if (this.input.key.forward) {
                vehicle.applyLocalForce(new CANNON.Vec3(0, 0, strengthForward));
            }
            if (this.input.key.backward) {
                vehicle.applyLocalForce(
                    new CANNON.Vec3(0, 0, -strengthForward)
                );
            }
            if (this.input.key.left) {
                vehicle.applyTorque(new CANNON.Vec3(0, strenghtSideways, 0));
            }
            if (this.input.key.right) {
                vehicle.applyTorque(new CANNON.Vec3(0, -strenghtSideways, 0));
            }

            _update.call(gameObject);
        };
    }
}

export class PlayerInput {
    constructor() {
        this.key = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
        };

        this._onKeyDown();
        this._onKeyUp();
    }

    _onKeyDown() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                case "ArrowUp":
                    this.key.forward = true;
                    break;

                case "s":
                case "ArrowDown":
                    this.key.backward = true;
                    break;

                case "a":
                case "ArrowLeft":
                    this.key.left = true;
                    break;

                case "d":
                case "ArrowRight":
                    this.key.right = true;
                    break;
                case "Shift":
                    this.key.shift = true;
                    break;
                case " ":
                case "Spacebar":
                    this.key.space = true;
                    break;
            }
        });
    }

    _onKeyUp() {
        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "w":
                case "ArrowUp":
                    this.key.forward = false;
                    break;

                case "s":
                case "ArrowDown":
                    this.key.backward = false;
                    break;

                case "a":
                case "ArrowLeft":
                    this.key.left = false;
                    break;

                case "d":
                case "ArrowRight":
                    this.key.right = false;
                    break;
                case "Shift":
                    this.key.shift = false;
                    break;
                case " ":
                case "Spacebar":
                    this.key.space = false;
                    break;
            }
        });
    }
}
