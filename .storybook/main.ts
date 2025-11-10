import path from "path";
import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.mdx", "../components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@chromatic-com/storybook"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      builder: {
        viteConfigPath: path.resolve(__dirname, "./vite.config.ts"),
      },
    },
  },
};

export default config;
