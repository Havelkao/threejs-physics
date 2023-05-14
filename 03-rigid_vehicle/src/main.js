import './style.css'
import { World } from "./World/World";

const container = document.querySelector("#app");
const world = new World(container);
world.start();