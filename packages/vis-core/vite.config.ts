import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "VisFrameworkCore",
      formats: ["es", "cjs"],
      fileName: (fmt) => (fmt === "es" ? "index.js" : "index.cjs")
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" }
      }
    },
    sourcemap: true
  },
  plugins: [dts({ 
      tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
      insertTypesEntry: true
   })]
});
