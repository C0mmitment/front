import Constants from 'expo-constants';
import { Redirect } from 'expo-router';

export default function Index() {
  const isStorybookEnabled = Constants.expoConfig?.extra?.storybookEnabled === 'true';

  if (isStorybookEnabled) {
    return <Redirect href="/(storybook)" />;
  }

  return <Redirect href="/home" />;
}
