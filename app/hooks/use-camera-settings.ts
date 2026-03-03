// hooks/use-camera-settings.ts
import { useContext } from 'react';

import { CameraSettingsContext } from '../contexts/camera-settings-context';

export const useCameraSettings = () => {
  const ctx = useContext(CameraSettingsContext);
  if (!ctx) throw new Error('useCameraSettings must be used inside CameraSettingsProvider');
  return ctx;
};
