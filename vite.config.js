import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                nested: resolve(__dirname, "01-basics/index.html"),
                nested: resolve(__dirname, "02-controls/index.html"),
                nested: resolve(__dirname, "03-rigid_vehicle/index.html"),
                nested: resolve(__dirname, "04-raycast_vehicle/index.html"),
            },
        },
    },
});
