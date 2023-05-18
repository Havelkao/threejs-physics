import * as CANNON from "cannon-es";
import nipplejs from "nipplejs";

export class PlayerController {
    constructor(gameObject, container) {
        this.gameObject = gameObject;
        this.input = new PlayerInput(container);
        const _update = gameObject.update;

        gameObject.update = () => {
            const vehicle = this.gameObject.rb;

            const force = 500 * this.input.joystick.strength.y;
            const steering = 80 * this.input.joystick.strength.x;

            if (this.input.direction.forward) {
                vehicle.applyLocalForce(new CANNON.Vec3(0, 0, force));
            }
            if (this.input.direction.backward) {
                vehicle.applyLocalForce(new CANNON.Vec3(0, 0, -force));
            }
            if (this.input.direction.left) {
                vehicle.applyTorque(new CANNON.Vec3(0, steering, 0));
            }
            if (this.input.direction.right) {
                vehicle.applyTorque(new CANNON.Vec3(0, -steering, 0));
            }

            _update.call(gameObject);
        };
    }
}

class PlayerInput {
    constructor(container) {
        this.direction = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };
        this.keyboard = new KeyboardInput(this.direction);
        this.joystick = new BasicJoystick(container, this.direction);
    }
}

export class KeyboardInput {
    constructor(direction) {
        this.direction = direction || {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };
        this.key = {
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
                    this.direction.forward = true;
                    break;

                case "s":
                case "ArrowDown":
                    this.direction.backward = true;
                    break;

                case "a":
                case "ArrowLeft":
                    this.direction.left = true;
                    break;

                case "d":
                case "ArrowRight":
                    this.direction.right = true;
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
                    this.direction.forward = false;
                    break;

                case "s":
                case "ArrowDown":
                    this.direction.backward = false;
                    break;

                case "a":
                case "ArrowLeft":
                    this.direction.left = false;
                    break;

                case "d":
                case "ArrowRight":
                    this.direction.right = false;
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

class BasicJoystick {
    constructor(container, direction) {
        this.container = container;
        this.direction = direction || {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };
        this.strength = { x: 1, y: 1 };

        const joystick = nipplejs.create({
            zone: container,
            mode: "dynamic",
            position: { left: "50%", top: "50%" },
            color: "white",
        });

        joystick.on("move", (_, data) => {
            this.strength.x = Math.abs(data.vector.x);
            this.strength.y = Math.abs(data.vector.y);

            if (data.direction?.x == "left") {
                this.direction.left = true;
                this.direction.right = false;
            }

            if (data.direction?.x == "right") {
                this.direction.left = false;
                this.direction.right = true;
            }

            if (data.direction?.y == "up") {
                console.log("setting");
                this.direction.forward = true;
                this.direction.backward = false;
            }

            if (data.direction?.y == "down") {
                this.direction.forward = false;
                this.direction.backward = true;
            }
        });

        joystick.on("end", () => {
            this.strength.x = 1;
            this.strength.y = 1;

            this.direction.forward = false;
            this.direction.backward = false;
            this.direction.left = false;
            this.direction.right = false;
        });
    }
}
