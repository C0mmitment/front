// app/home/index.tsx
import React, { useState, useEffect } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { View, Alert, TouchableOpacity } from 'react-native';

import { useCameraPermissions } from 'expo-camera';

import CameraPreview from '@/(features)/home/components/camera-preview';
import SettingDrawer from '@/(features)/home/components/setting-drawer';
import ShutterScroll from '@/(features)/home/components/shutter-scroll';
import { colors } from '@/constants/color';
import { useCameraActions } from '@/hooks/use-camera-actions';
import { useCameraSettings } from '@/hooks/use-camera-settings';
import { useFirstLaunchFlag } from '@/hooks/use-first-launch-flag';
import { useLocationSetting } from '@/hooks/use-location-setting';

import type { CameraMode } from '@/types/camera';

export default function HomePage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<CameraMode>('normal');

  const { flash, setFlash, ratio, setRatio, grid, setGrid } = useCameraSettings();
  const { cameraRef, facing, zoom, updateZoom, takePicture, openPhotoFolder, toggleCameraFacing } =
    useCameraActions();

  const { locationEnabled, setLocationEnabled, isLoaded } = useLocationSetting();
  const { hasSeen, isLoaded: firstLoaded, markSeen } = useFirstLaunchFlag();

  // 初回起動時のアラートロジック
  useEffect(() => {
    if (!firstLoaded || !isLoaded) return;
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

      {/* カメラプレビュー */}
      <View className="flex-1 items-center justify-center overflow-hidden">
        <CameraPreview
          cameraRef={cameraRef}
          facing={facing}
          zoom={zoom}
          flash={flash}
          ratio={ratio}
          grid={grid}
          onUpdateZoom={updateZoom}
        />
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
