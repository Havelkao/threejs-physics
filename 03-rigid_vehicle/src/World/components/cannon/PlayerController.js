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
            const maxSteerVal = Math.PI / 6;
            const maxForce = 140;

            switch (event.key) {
                case "w":
                case "ArrowUp":
                    vehicle.setWheelForce(maxForce, 2);
                    vehicle.setWheelForce(-maxForce, 3);
                    break;

                case "s":
                case "ArrowDown":
                    vehicle.setWheelForce(-maxForce, 2);
                    vehicle.setWheelForce(maxForce, 3);
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

            const maxSteerVal = Math.PI / 6;
            const maxForce = 140;

            const force = maxForce * y;
            const steer = maxSteerVal * x;

            vehicle.setWheelForce(force, 2);
            vehicle.setWheelForce(-force, 3);
            vehicle.setSteeringValue(-steer, 0);
            vehicle.setSteeringValue(-steer, 1);
        });

        joystick.on("end", () => {
            vehicle.setWheelForce(0, 2);
            vehicle.setWheelForce(0, 3);
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
        });
    }
}
