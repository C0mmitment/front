import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';

import { View, Text, Pressable, Switch, TouchableOpacity } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  locationEnabled: boolean;
  onChangeLocationEnabled: (next: boolean) => void;
  flash: 'off' | 'on' | 'auto';
  onChangeFlash: (next: 'off' | 'on' | 'auto') => void;
};

export default function SettingDrawer({
  visible,
  onClose,
  locationEnabled,
  onChangeLocationEnabled,
  flash,
  onChangeFlash,
}: Props) {
  if (!visible) return null;

  // フラッシュ切り替え
  const nextFlash = () => {
    const order: ('off' | 'on' | 'auto')[] = ['off', 'on', 'auto'];
    const next = order[(order.indexOf(flash) + 1) % order.length];
    onChangeFlash(next);
  };

  return (
    <>
      <Pressable onPress={onClose} className="absolute inset-0 z-40" />

      <View className="absolute left-[14px] right-[14px] top-[120px] z-50 rounded-[18px] border border-black/5 bg-white/80 px-4 py-3.5 shadow-xl">
        <Text className="mb-3 text-[13px] font-bold opacity-70">設定</Text>
        <View className="my-2 flex-row gap-10">
          {/* フラッシュ */}
          <TouchableOpacity onPress={nextFlash} className="flex-col items-center gap-2">
            <Ionicons
              name={flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-outline' : 'flash-off'}
              size={24}
              color="black"
            />
            <Text>{flash.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* 現在地取得のトグル */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[15px] font-semibold opacity-90">現在地を利用を許可</Text>
          <Switch value={locationEnabled} onValueChange={onChangeLocationEnabled} />
        </View>
      </View>
    </>
  );
}
