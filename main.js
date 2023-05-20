import { render, html, svg } from "uhtml";

const pages = [
    {
        title: "Basics",
        html: "01-basics/index.html",
        image: "basics.png",
    },
    {
        title: "Basic Vehicle",
        html: "02-basic_vehicle/index.html",
        image: "basic_vehicle.png",
    },
    {
        title: "Rigid Vehicle",
        html: "03-rigid_vehicle/index.html",
        image: "rigid_vehicle.png",
    },
    {
        title: "Raycast Vehicle",
        html: "04-raycast_vehicle/index.html",
        image: "raycast_vehicle.png",
    },
];

const Card = (page) => {
    return html` <div class="card">
        <div class="card-image">
            <a href="${page.html}" target="blank">
                <img src="${page.image}" :alt="image" rel="preload" />
                <div class="card-title">${page.title}</div>
            </a>
        </div>
    </div>`;
};

render(
    document.querySelector("#app"),
    html` ${pages.map((page) => Card(page))} `
);
