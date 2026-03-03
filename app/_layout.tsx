import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { View, ActivityIndicator } from 'react-native';

import { Slot } from 'expo-router';

import { CompareProvider } from './contexts/compare-context';
import { TipsProvider } from './contexts/tips-context';
import { useAppUuid } from './hooks/use-app-uuid';
import { CameraSettingsProvider } from './contexts/camera-settings-context';

import '../global.css';

export default function RootLayout() {
  const { uuid, isLoaded } = useAppUuid();

  // UUID準備ができるまで下を描画しない
  if (!isLoaded || !uuid) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CompareProvider>
        <TipsProvider>
          <CameraSettingsProvider>
            <Slot />
          </CameraSettingsProvider>
        </TipsProvider>
      </CompareProvider>
    </GestureHandlerRootView>
  );
}
