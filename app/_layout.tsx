import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Slot } from 'expo-router';

import { TipsProvider } from './contexts/tipsContext';
import { CameraSettingsProvider } from '../app/contexts/cameraSettingsContext';

import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TipsProvider>
        <CameraSettingsProvider>
          <Slot />
        </CameraSettingsProvider>
      </TipsProvider>
    </GestureHandlerRootView>
  );
}
