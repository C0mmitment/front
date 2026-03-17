import { useEffect, useState, useMemo } from 'react';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as FileSystem from 'expo-file-system/legacy';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Image, Text, View, TouchableOpacity } from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import * as Sharing from 'expo-sharing';

import { getPhotoAdvice } from '@/(features)/advice/api/advice-api';
import AdviceCard from '@/components/advice-card/advice-card';
import IconButton from '@/components/icon-button/icon-button';
import PhotoTips from '@/components/tips/tips';
import { colors } from '@/constants/color';
import { useTips } from '@/contexts/tips-context';
import { usePhotoAdviceVisuals } from '@/hooks/use-photo-advice-visuals';
import ArrowImg from '@assets/arrow.png';

import type { VisualCue } from '@/(features)/advice/api/advice-api';
import type { AdviceStatus } from '@/types/advice';

export default function PhotoSelectedPage() {
  const [advice, setAdvice] = useState<string>('ここにAIからのアドバイスが表示されます...');
  const [status, setStatus] = useState<AdviceStatus>('first_time');
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [ratio, setRatio] = useState<number>(1);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  const showVisuals = !isLoading && !!visualCue;

  const { getRandomTip } = useTips();
  const tips = useMemo(() => getRandomTip(), [getRandomTip]);

  const { arrowStyle, arrowPositionStyle, boxStyle, isDepth } = usePhotoAdviceVisuals({
    direction: visualCue?.direction,
  });

  // 画像をbox内で最大サイズにするための計算
  const fitted = (() => {
    if (!box || !ratio) return null;
    const W = box.w;
    const H = box.h;

    // まず幅を最大にして高さを計算
    let w = W;
    let h = W / ratio;

    // 高さが超えるなら高さを最大に幅を計算
    if (h > H) {
      h = H;
      w = H * ratio;
    }

    return { w, h };
  })();

  useEffect(() => {
    if (!uri) return;
    Image.getSize(
      uri,
      (w, h) => setRatio(w / h),
      () => setRatio(1),
    );
  }, [uri]);

  async function shareImage() {
    if (!uri) return;

    try {
      const tempPath = FileSystem.cacheDirectory! + 'shared-image.jpg';

      await FileSystem.copyAsync({
        from: uri,
        to: tempPath,
      });

      await Sharing.shareAsync(tempPath);
    } catch (error) {
      console.log('Share error:', error);
    }
  }

  // アドバイス取得
  async function fetchAdvice() {
    if (!uri || isLoading) return;

    try {
      setIsLoading(true);

      const res = await getPhotoAdvice(uri, false, null, 'normal');

      setAdvice(res.analysis.advice);
      setStatus(res.analysis.status);
      setVisualCue(res.analysis.visual_cues?.[0] ?? null);
    } catch (e) {
      console.error(e);
      setAdvice('アドバイスの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 上部 UI */}
      <View className="flex-row items-center justify-start bg-white px-4 py-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* 写真表示エリア */}
      <View
        className="flex-1 items-center justify-center bg-gray-100"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setBox({ w: width, h: height });
        }}
      >
        {uri ? (
          fitted ? (
            <View style={{ width: fitted.w, height: fitted.h }} className="relative">
              {/* 画像 */}
              <Image source={{ uri }} className="h-full w-full" resizeMode="contain" />

              {/* 枠 */}
              {showVisuals && isDepth && (
                <Animated.View
                  className="absolute left-[15%] top-[20%] h-[60%] w-[70%] rounded-xl border-4 border-yellow-300"
                  style={boxStyle}
                />
              )}

              {/* 矢印 */}
              {showVisuals && !isDepth && (
                <Animated.Image
                  source={ArrowImg}
                  className="tint-blue-300 absolute h-20 w-20"
                  style={[arrowPositionStyle, arrowStyle]}
                  resizeMode="contain"
                />
              )}
            </View>
          ) : null
        ) : (
          <Text className="text-black">画像がありません</Text>
        )}
      </View>

      {/* Tips & アドバイス */}
      <View className="m-4">
        {isLoading && tips ? (
          <PhotoTips title={tips.title} content={tips.content} category={tips.category} />
        ) : (
          <AdviceCard advice={advice} status={status} />
        )}
      </View>
      <View className="flex flex-row justify-center gap-10 p-5">
        {/* AIに聞くボタン */}
        <IconButton
          icon={<FontAwesome6 name="robot" size={28} color={colors.primary} />}
          label="AIに聞く"
          onPress={fetchAdvice}
        />

        {/* 共有するボタン */}
        <IconButton
          icon={<FontAwesome6 name="share-nodes" size={28} color={colors.primary} />}
          label="共有する"
          onPress={shareImage}
        />
      </View>
    </SafeAreaView>
  );
}
