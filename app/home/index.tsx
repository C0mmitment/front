// app/home/home.tsx
import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCameraActions } from "../hooks/useCameraActions";
import ShutterScroll from "./components/shutter-scroll";
import SettingDrawer from "./components/setting-drawer";
import { colors } from "../constans/color";
import { useLocationSetting } from "../hooks/useLocationSetting";
import { useFirstLaunchFlag } from "../hooks/useFirstLaunchFlag";
import type { CameraMode } from "../types/camera";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';

export default function HomePage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<CameraMode>("normal");
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");

  const {
    cameraRef,
    facing,
    zoom,
    updateZoom,
    takePicture,
    openPhotoFolder,
    toggleCameraFacing,
  } = useCameraActions();

  // --- ジェスチャーロジック ---
  const baseZoom = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      // ジェスチャー開始時のズーム値を保存
      baseZoom.value = zoom;
    })
    .onUpdate((event) => {
      // JSスレッドの updateZoom を呼び出す
      runOnJS(updateZoom)(event.scale, baseZoom.value);
    });

  const {
    locationEnabled,    // 現在地利用の状態
    setLocationEnabled, // ON/OFF切り替え
    isLoaded            // 読み込み終了フラグ
  } = useLocationSetting();

  const {
    hasSeen,
    isLoaded: firstLoaded,
    markSeen
  } = useFirstLaunchFlag();

  useEffect(() => {
    // 読み込みが揃うまで何もしない
    if (!firstLoaded) return;
    if (!isLoaded) return;

    // 初回だけ
    if (!hasSeen) {
      Alert.alert(
        "位置情報の利用について",
        "撮影場所の記録・ヒートマップ作成に使用します。あとから設定で変更できます。",
        [
          {
            text: "今はしない",
            style: "cancel",
            onPress: async () => {
              await setLocationEnabled(false);
              await markSeen();
            },
          },
          {
            text: "OK",
            onPress: async () => {
              await setLocationEnabled(true);
              await markSeen();
            },
          },
        ]
      );
    }
  }, [firstLoaded, isLoaded, hasSeen, markSeen, setLocationEnabled]);


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

  // 権限読み込み中は何も出さない
  if (!isLoaded) return <View className="flex-1 bg-black" />;

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* 上部 UI */}
      <View className="bg-white px-4 py-5 flex-row items-center justify-end">
        <TouchableOpacity onPress={() => setSettingsOpen(true)}>
          <Ionicons name="settings-sharp" size={32} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* カメラビュー */}
      <GestureDetector gesture={pinchGesture}>
        <View className="flex-1">
          <CameraView 
            ref={cameraRef} 
            style={{ flex: 1 }} 
            facing={facing} 
            zoom={zoom}
            flash={flash}
          />
        </View>
      </GestureDetector>

      {/* 設定パネル */}
      <SettingDrawer
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        locationEnabled={locationEnabled}
        onChangeLocationEnabled={setLocationEnabled}
        flash={flash}
        onChangeFlash={setFlash}
      />

      {/* 下部 UI */}
      <View className="absolute bottom-6 w-full">
        <ShutterScroll
          selectedMode={mode}
          onSelectMode={setMode}
          onShutterPress={takePicture}
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
