// app/home/home.tsx
import React from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCameraActions } from "../hooks/useCameraActions";
import ShutterScroll from "./components/shutter-scroll";
import { colors } from "../constans/color";

export default function HomePage() {
  const [permission, requestPermission] = useCameraPermissions();

  const {
    cameraRef,
    facing,
    takePicture,
    openPhotoFolder,
    toggleCameraFacing,
  } = useCameraActions();

  // 権限チェック
  if (!permission) return <View className="flex-1 bg-black" />;
  if (!permission.granted) {
    Alert.alert(
      '"TotteMe!" がカメラアクセスを求めています。',
      "",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "許可する", onPress: () => requestPermission() },
      ]
    );
    return <View className="flex-1 bg-black" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

      {/* 下部 UI */}
      <View className="absolute bottom-10 w-full">
        <ShutterScroll
          onPress={(mode) => {
            if (mode === "normal") takePicture();
            if (mode === "people") takePicture();
            if (mode === "food") takePicture();
          }}
          className="py-5"
        />
        <View className="bg-white flex-row items-center justify-between pb-5">
          {/* 画像アイコン */}
          <TouchableOpacity className="w-15 items-center mx-3" onPress={openPhotoFolder}>
            <FontAwesome name="picture-o" size={32} color={colors.secondary} />
          </TouchableOpacity>
          {/* 内外切り替えアイコン */}
          <TouchableOpacity className="w-15 items-center mx-3" onPress={toggleCameraFacing}>
            <FontAwesome6 name="camera-rotate" size={32} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
