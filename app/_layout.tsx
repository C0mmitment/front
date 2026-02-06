import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Slot } from 'expo-router';

import { CompareProvider } from './contexts/compareContext';
import { CameraSettingsProvider } from '../app/contexts/cameraSettingsContext';

import '../global.css';

export default function RootLayout() {
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
