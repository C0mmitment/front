import React from 'react';

import { View, Text, Pressable, Switch } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  locationEnabled: boolean;
  onChangeLocationEnabled: (next: boolean) => void;
};

export default function SettingDrawer({
  visible,
  onClose,
  locationEnabled,
  onChangeLocationEnabled,
}: Props) {
  if (!visible) return null;

  return (
    <>
      {/* 外タップ用オーバーレイ */}
      <Pressable onPress={onClose} className="absolute inset-0 z-40" />

      {/* パネル本体 */}
      <View className="absolute left-[14px] right-[14px] top-[120px] z-50 rounded-[18px] border border-black/5 bg-white/80 px-4 py-3.5 shadow-xl">
        {/* 見出し */}
        <Text className="mb-3 text-[13px] font-bold opacity-70">設定</Text>

        {/* トグル */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[15px] font-semibold opacity-90">現在地を利用を許可</Text>
          <Switch value={locationEnabled} onValueChange={onChangeLocationEnabled} />
        </View>
      </View>
    </>
  );
}
