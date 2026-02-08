import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { View, ActivityIndicator } from 'react-native';

import { Slot } from 'expo-router';

import { CompareProvider } from './contexts/compareContext';
import { useAppUuid } from './hooks/useAppUuid';
import { CameraSettingsProvider } from '../app/contexts/cameraSettingsContext';

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
        <CameraSettingsProvider>
          <Slot />
        </CameraSettingsProvider>
      </CompareProvider>
    </GestureHandlerRootView>
  );
}
