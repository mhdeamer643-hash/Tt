import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      external: ['اسم_الوحدة_التي_تريد_استبعادها']
    }
  }
});
