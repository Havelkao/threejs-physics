import nipplejs from "nipplejs";

export class PlayerController {
    constructor(vehicle, container) {
        this.vehicle = vehicle;
        this.container = container;
        this.addKeyBinding(vehicle);
        this.joystick = new Joystick(container, vehicle);
    }

    addKeyBinding(vehicle) {
        document.addEventListener("keydown", (event) => {
            const maxSteerVal = 0.5;
            const maxForce = 500;
            const brakeForce = 1000000;

            switch (event.key) {
                case "w":
                case "ArrowUp":
                    vehicle.applyEngineForce(-maxForce, 2);
                    vehicle.applyEngineForce(-maxForce, 3);
                    break;

                case "s":
                case "ArrowDown":
                    vehicle.applyEngineForce(maxForce, 2);
                    vehicle.applyEngineForce(maxForce, 3);
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
                    vehicle.applyEngineForce(0, 2);
                    vehicle.applyEngineForce(0, 3);
                    break;

                case "s":
                case "ArrowDown":
                    vehicle.applyEngineForce(0, 2);
                    vehicle.applyEngineForce(0, 3);
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

class Joystick {
    constructor(container, vehicle) {
        this.container = container;

        const joystick = nipplejs.create({
            zone: container,
            mode: "dynamic",
            position: { left: "50%", top: "50%" },
            color: "white",
        });

        joystick.on("move", (_, data) => {
            const { x, y } = data.vector;

            const maxSteerVal = 0.5;
            const maxForce = 500;

            const force = maxForce * y;
            const steer = maxSteerVal * x;

            vehicle.applyEngineForce(-force, 2);
            vehicle.applyEngineForce(-force, 3);
            vehicle.setSteeringValue(-steer, 0);
            vehicle.setSteeringValue(-steer, 1);
        });

        joystick.on("end", () => {
            vehicle.applyEngineForce(0, 2);
            vehicle.applyEngineForce(0, 3);
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
        });
    }
}
