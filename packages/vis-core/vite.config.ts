import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      include: ['src/index.ts', 'src/**/index.*'],
      tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index:     path.resolve(__dirname, 'src/index.tsx'),
        Components:path.resolve(__dirname, 'src/Components/index.js'),
        contexts:  path.resolve(__dirname, 'src/contexts/index.js'),
        hocs:      path.resolve(__dirname, 'src/hocs/index.js'),
        hooks:     path.resolve(__dirname, 'src/hooks/index.js'),
        layouts:   path.resolve(__dirname, 'src/layouts/index.js'),
        reducers:  path.resolve(__dirname, 'src/reducers/index.js'),
        services:  path.resolve(__dirname, 'src/services/index.js'),
        utils:     path.resolve(__dirname, 'src/utils/index.js'),
      },
      name: "VisFrameworkCore",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", 'react-router-dom', '@mapbox/mapbox-gl-draw', 'mapbox-gl', '@turf/turf', 'chroma-js', "polished", "js-cookie"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" }
      }
    },
    sourcemap: true
  }
});
