import React from "react";
import { View, Text, Pressable, Switch, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  visible: boolean;
  onClose: () => void;
  locationEnabled: boolean;
  onChangeLocationEnabled: (next: boolean) => void;
  flash: "off" | "on" | "auto";
  onChangeFlash: (next: "off" | "on" | "auto") => void;
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
    const order: ("off" | "on" | "auto")[] = ["off", "on", "auto"];
    const next = order[(order.indexOf(flash) + 1) % order.length];
    onChangeFlash(next);
  };

  return (
    <>
      <Pressable onPress={onClose} className="absolute inset-0 z-40"/>

      <View className="absolute top-[120px] left-[14px] right-[14px] z-50 rounded-[18px] px-4 py-3.5 bg-white/80 border border-black/5 shadow-xl">
        <Text className="text-[13px] font-bold opacity-70 mb-3">設定</Text>
        <View className="flex-row gap-10 my-2">
          {/* フラッシュ */}
          <TouchableOpacity onPress={nextFlash} className="items-center flex-col gap-2">
            <Ionicons
              name={flash === "on" ? "flash" : flash === "auto" ? "flash-outline" : "flash-off"}
              size={24}
              color="black"
            />
            <Text>{flash.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* 現在地取得のトグル */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[15px] font-semibold opacity-90">
            現在地を利用を許可
          </Text>
          <Switch value={locationEnabled} onValueChange={onChangeLocationEnabled}/>
        </View>
      </View>
    </>
  );
}
