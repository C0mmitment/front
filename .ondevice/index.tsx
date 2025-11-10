import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";

// Get the Storybook UI component using the getStorybookUI method
const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
