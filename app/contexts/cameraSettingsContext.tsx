// app/contexts/cameraSettingsContext.tsx
import React, { createContext, useMemo, useState, ReactNode } from 'react';

export type FlashMode = 'off' | 'on' | 'auto';
export type CameraRatio = '4:3' | '1:1' | '16:9';

export type CameraSettingsContextType = {
  flash: FlashMode;
  setFlash: React.Dispatch<React.SetStateAction<FlashMode>>;
  ratio: CameraRatio;
  setRatio: React.Dispatch<React.SetStateAction<CameraRatio>>;
};

export const CameraSettingsContext = createContext<CameraSettingsContextType | undefined>(
  undefined,
);

export const CameraSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [flash, setFlash] = useState<FlashMode>('off');
  const [ratio, setRatio] = useState<CameraRatio>('4:3');

  const value = useMemo(() => ({ flash, setFlash, ratio, setRatio }), [flash, ratio]);

  return <CameraSettingsContext.Provider value={value}>{children}</CameraSettingsContext.Provider>;
};
