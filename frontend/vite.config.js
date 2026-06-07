import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
    host: true,
    allowedHosts: [
      'collab-editor-alb-2051774917.ap-south-1.elb.amazonaws.com'
    ]
  }
});