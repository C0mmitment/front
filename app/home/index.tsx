// app/home/index.tsx
import React, { useState, useEffect } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { View, Alert, TouchableOpacity } from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';

import { useCameraActions } from '../hooks/useCameraActions';
import { useCameraSettings } from '../hooks/useCameraSettings';
import CameraGrid from './components/camera-grid';
import SettingDrawer from './components/setting-drawer';
import ShutterScroll from './components/shutter-scroll';
import { colors } from '../constans/color';
import { useFirstLaunchFlag } from '../hooks/useFirstLaunchFlag';
import { useLocationSetting } from '../hooks/useLocationSetting';

import type { CameraMode } from '../types/camera';

export default function HomePage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<CameraMode>('normal');
  const { flash, setFlash, ratio, setRatio, grid, setGrid } = useCameraSettings();

  const { cameraRef, facing, zoom, updateZoom, takePicture, openPhotoFolder, toggleCameraFacing } =
    useCameraActions();
  const aspectRatios: Record<string, number> = {
    '4:3': 3 / 4,
    '16:9': 9 / 16,
    '1:1': 1 / 1,
  };

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

  const { locationEnabled, setLocationEnabled, isLoaded } = useLocationSetting();
  const { hasSeen, isLoaded: firstLoaded, markSeen } = useFirstLaunchFlag();

  useEffect(() => {
    if (!firstLoaded || !isLoaded) return;

    // 初回だけ
    if (!hasSeen) {
      Alert.alert(
        '位置情報の利用について',
        '撮影場所の記録・ヒートマップ作成に使用します。あとから設定で変更できます。',
        [
          {
            text: '今はしない',
            style: 'cancel',
            onPress: async () => {
              await setLocationEnabled(false);
              await markSeen();
            },
          },
          {
            text: 'OK',
            onPress: async () => {
              await setLocationEnabled(true);
              await markSeen();
            },
          },
        ],
      );
    }
  }, [firstLoaded, isLoaded, hasSeen, markSeen, setLocationEnabled]);

  // 権限チェック
  if (!permission) return <View className="flex-1 bg-black" />;
  if (!permission.granted) {
    Alert.alert('"TotteMe!" がカメラアクセスを求めています。', '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '許可する', onPress: () => requestPermission() },
    ]);
    return <View className="flex-1 bg-black" />;
  }

  // 権限読み込み中は何も出さない
  if (!isLoaded) return <View className="flex-1 bg-black" />;

  return (
    <SafeAreaView className="relative flex-1 bg-white">
      {/* 上部 UI */}
      <View className="absolute top-12 z-50 w-full flex-row justify-end px-4 py-5">
        <TouchableOpacity onPress={() => setSettingsOpen((prev) => !prev)}>
          <Ionicons name="settings-sharp" size={32} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* カメラビュー */}
      <View className="flex-1 items-center justify-center overflow-hidden">
        <GestureDetector gesture={pinchGesture}>
          <View
            style={{
              width: '100%',
              aspectRatio: aspectRatios[ratio] || 3 / 4,
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
      </View>

      {/* 下部 UI */}
      <View className="absolute bottom-10 w-full pb-6">
        <ShutterScroll selectedMode={mode} onSelectMode={setMode} onShutterPress={takePicture} />
        <View className="flex-row items-center justify-between px-10 pt-2">
          <TouchableOpacity onPress={openPhotoFolder}>
            <FontAwesome name="picture-o" size={32} color={colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCameraFacing}>
            <FontAwesome6 name="camera-rotate" size={32} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 設定パネル */}
      <SettingDrawer
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        locationEnabled={locationEnabled}
        onChangeLocationEnabled={setLocationEnabled}
        flash={flash}
        onChangeFlash={setFlash}
        ratio={ratio}
        onChangeRatio={setRatio}
        grid={grid}
        onChangeGrid={setGrid}
      />
    </SafeAreaView>
  );
}
