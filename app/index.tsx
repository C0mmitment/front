import { Redirect } from "expo-router";
import Constants from "expo-constants";

export default function Index() {
  const isStorybookEnabled = Constants.expoConfig?.extra?.storybookEnabled === "true";

  if (isStorybookEnabled) {
    return <Redirect href="/(storybook)" />;
  }

  return <Redirect href="/(pages)" />;
}
