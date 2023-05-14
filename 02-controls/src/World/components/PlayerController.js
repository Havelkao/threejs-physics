import * as CANNON from "cannon-es";

export class PlayerController {
    constructor(gameobject) {
        this.gameobject = gameobject;
    }

    add(vehicle) {
        document.addEventListener("keydown", (event) => {
            const strengthForward = 200;
            const strenghtSideways = 20;

            switch (event.key) {
                case "w":
                case "ArrowUp":
                    vehicle.applyLocalForce(
                        new CANNON.Vec3(0, 0, strengthForward)
                    );
                    break;

                case "s":
                case "ArrowDown":
                    vehicle.applyLocalForce(
                        new CANNON.Vec3(0, 0, -strengthForward)
                    );
                    break;

                case "a":
                case "ArrowLeft":
                    vehicle.applyTorque(0, strenghtSideways, 0);
                    break;

                case "d":
                case "ArrowRight":
                    vehicle.applyTorque(0, -strenghtSideways, 0);
                    break;
            }
        });
    }
}
