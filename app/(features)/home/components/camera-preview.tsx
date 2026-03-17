import React from 'react';

import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';

import { View } from 'react-native';

import { CameraView, CameraRatio } from 'expo-camera'; // CameraRatio を追加

import CameraGrid from '@/(features)/home/components/camera-grid';

interface CameraPreviewProps {
  cameraRef: React.RefObject<any>;
  facing: 'front' | 'back';
  zoom: number;
  flash: 'on' | 'off' | 'auto';
  ratio: CameraRatio;
  grid: boolean;
  onUpdateZoom: (scale: number, baseZoom: number) => void;
}

const ASPECT_RATIOS: Record<string, number> = {
  '4:3': 3 / 4,
  '16:9': 9 / 16,
  '1:1': 1 / 1,
};

export default function CameraPreview({
  cameraRef,
  facing,
  zoom,
  flash,
  ratio,
  grid,
  onUpdateZoom,
}: CameraPreviewProps) {
  const baseZoom = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      baseZoom.value = zoom;
    })
    .onUpdate((event) => {
      runOnJS(onUpdateZoom)(event.scale, baseZoom.value);
    });

  return (
    <GestureDetector gesture={pinchGesture}>
      <View
        style={{
          width: '100%',
          aspectRatio: ASPECT_RATIOS[ratio as string] || 3 / 4,
        }}
      >
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          zoom={zoom}
          flash={flash}
          ratio={ratio}
        />
        <CameraGrid enabled={grid} />
      </View>
    </GestureDetector>
  );
}
