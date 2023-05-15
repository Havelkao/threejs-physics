export class PlayerController {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.addKeyBinding(vehicle);
    }

    addKeyBinding(vehicle) {
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
