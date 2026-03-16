import React from 'react';

import { View } from 'react-native';

export default function CameraGrid({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <View pointerEvents="none" className="absolute inset-0">
      {/* 縦 */}
      <View className="absolute bottom-0 left-1/3 top-0 w-[1px] bg-white/50" />
      <View className="absolute bottom-0 left-2/3 top-0 w-[1px] bg-white/50" />

      {/* 横 */}
      <View className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/50" />
      <View className="absolute left-0 right-0 top-2/3 h-[1px] bg-white/50" />
    </View>
  );
}
