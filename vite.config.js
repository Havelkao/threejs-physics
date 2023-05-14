import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                basics: resolve(__dirname, "01-basics/index.html"),
                slippery: resolve(__dirname, "02-basic_vehicle/index.html"),
                rigid: resolve(__dirname, "03-rigid_vehicle/index.html"),
                raycast: resolve(__dirname, "04-raycast_vehicle/index.html"),
            },
        },
    },
});
