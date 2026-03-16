import React, { useMemo } from 'react';

import { Ionicons, Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Image, Text, View, TouchableOpacity } from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';

import ArrowImg from '../../../assets/arrow.png';
import AdviceCard from '../../components/advice-card/advice-card';
import IconButton from '../../components/icon-button/icon-button';
import PhotoTips from '../../components/tips/tips';
import { colors } from '../../constants/color';
import { useTips } from '../../contexts/tips-context';
import { useAdvicePageData } from '../../hooks/use-advice-page-data';
import { useImageLayout } from '../../hooks/use-image-layout';
import { usePhotoAdviceVisuals } from '../../hooks/use-photo-advice-visuals';
import CameraGrid from '../home/components/camera-grid';

import type { CameraMode } from '../../types/camera';

export default function AdvicePage() {
  const { uri, mode } = useLocalSearchParams<{
    uri: string;
    mode: CameraMode;
  }>();

  const { onLayout, fittedSize } = useImageLayout(uri);

  const { advice, status, isLoading, visualCue, handleCompare, handleSave, handleShare } =
    useAdvicePageData(uri, mode);

  const { arrowStyle, arrowPositionStyle, boxStyle, isDepth } = usePhotoAdviceVisuals({
    direction: visualCue?.direction,
  });

  const { getRandomTip } = useTips();
  const tips = useMemo(() => getRandomTip(), [getRandomTip]);

  const shouldShowVisuals = !isLoading && !!visualCue && !!fittedSize;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 上部 UI */}
      <View className="flex-row items-center justify-start bg-white px-4 py-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* --- プレビューエリア --- */}
      <View className="flex-1 items-center justify-center bg-gray-100" onLayout={onLayout}>
        {uri ? (
          fittedSize ? (
            <View style={{ width: fittedSize.w, height: fittedSize.h }} className="relative">
              {/* メイン画像 */}
              <Image source={{ uri }} className="h-full w-full" resizeMode="contain" />

              <CameraGrid enabled={true} />

              {/* 枠 or 矢印 */}
              {shouldShowVisuals &&
                (isDepth ? (
                  <Animated.View
                    className="absolute left-[15%] top-[20%] h-[60%] w-[70%] rounded-xl border-4 border-yellow-300"
                    style={boxStyle}
                  />
                ) : (
                  <Animated.Image
                    source={ArrowImg}
                    className="absolute h-20 w-20"
                    style={[{ tintColor: 'lightblue' }, arrowPositionStyle, arrowStyle]}
                    resizeMode="contain"
                  />
                ))}
            </View>
          ) : (
            <Text className="text-gray-400">読み込み中...</Text>
          )
        ) : (
          <Text className="text-black">画像が見つかりません</Text>
        )}
      </View>

      {/* アドバイス表示 */}
      <View className="m-4">
        {isLoading && tips ? (
          <PhotoTips title={tips.title} content={tips.content} category={tips.category} />
        ) : (
          <AdviceCard advice={advice} status={status} />
        )}
      </View>

      {/* ボタン表示 */}
      <View className="flex-row justify-center gap-8 p-5">
        <IconButton
          icon={
            <MaterialCommunityIcons name="camera-retake-outline" size={28} color={colors.primary} />
          }
          label="比較撮影"
          onPress={handleCompare}
        />
        <IconButton
          icon={<Feather name="download" size={28} color={colors.primary} />}
          label="保存する"
          onPress={handleSave}
        />
        <IconButton
          icon={<FontAwesome6 name="share-nodes" size={28} color={colors.primary} />}
          label="保存して共有"
          onPress={handleShare}
        />
      </View>
    </SafeAreaView>
  );
}
