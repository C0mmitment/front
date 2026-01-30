import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import { getPhotoAdvice } from "../api/advice-api";
import type { VisualCue } from "../api/advice-api";
import PhotoTips from "../components/Tips/tips";
import IconButton from "../components/icon-button/icon-button";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from "../constans/color";
import Ionicons from '@expo/vector-icons/Ionicons';
import ArrowImg from "../../assets/arrow.png"
import Animated from "react-native-reanimated";
import { usePhotoAdviceVisuals } from "../hooks/usePhotoAdviceVisuals";

export default function PhotoSelectedPage() {
  const [advice, setAdvice] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [ratio, setRatio] = useState<number>(1);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  const showVisuals = !isLoading && !!visualCue;

  const { arrowStyle, arrowPositionStyle, boxStyle, isDepth } =
    usePhotoAdviceVisuals({
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
      () => setRatio(1)
    );
  }, [uri]);

  async function shareImage() {
    if (!uri) return;

    try {
      const tempPath = FileSystem.cacheDirectory! + "shared-image.jpg";

      await FileSystem.copyAsync({
        from: uri,
        to: tempPath,
      });

      await Sharing.shareAsync(tempPath);
    } catch (error) {
      console.log("Share error:", error);
    }
  }

  // アドバイス取得
  async function fetchAdvice() {
    if (!uri || isLoading) return;

    try {
      setIsLoading(true);

      const res = await getPhotoAdvice(uri, false, null, "normal");

      setAdvice(res.analysis.advice);
      setVisualCue(res.analysis.visual_cues?.[0] ?? null);

    } catch (e) {
      console.error(e);
      setAdvice("アドバイスの取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">

      {/* 上部 UI */}
      <View className="bg-white px-4 py-5 flex-row items-center justify-start">
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
              <Image source={{ uri }} className="w-full h-full" resizeMode="contain" />

              {/* 枠 */}
              {showVisuals && isDepth && (
                <Animated.View
                  className="absolute top-[20%] left-[15%] w-[70%] h-[60%] border-4 border-yellow-300 rounded-xl"
                  style={boxStyle}
                />
              )}

              {/* 矢印 */}
              {showVisuals && !isDepth && (
                <Animated.Image
                  source={ArrowImg}
                  className="absolute w-20 h-20 tint-blue-300"
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
        {isLoading ? (
          <PhotoTips />
        ) : (
          <Text className="text-red-500">{advice}</Text>
        )}
      </View>
      <View className="flex flex-row p-5 gap-10 justify-center">
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
