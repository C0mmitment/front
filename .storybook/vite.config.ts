import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: ["nativewind/babel"],
        plugins: [
          "react-native-reanimated/plugin",
          [
            "@babel/plugin-transform-react-jsx",
            {
              runtime: "automatic",
              importSource: "nativewind",
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
    extensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js"],
  },
  optimizeDeps: {
    include: ["react-native-reanimated", "nativewind", "react-native-css-interop"],
  },
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
});
