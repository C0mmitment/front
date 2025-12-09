import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';
import Animated from "react-native-reanimated";
import { Button } from "../components/Button/Button";
import { getPhotoAdvice } from "../api/advice-api";
import type { VisualCue } from "../api/advice-api";
import { usePhotoAdviceVisuals } from "../hooks/usePhotoAdviceVisuals";
import ArrowImg from "./assets/arrow.png";

export default function AdvicePage() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [advice, setAdvice] = useState<string>("ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。");
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);

  // directionをhookに渡す
  const { arrowStyle, arrowPositionStyle, boxStyle, isDepth } = usePhotoAdviceVisuals({
    direction: visualCue?.direction,
  });

  // アドバイス取得
  useEffect(() => {
    if (!uri) return;

    const fetchAdvice = async () => {
      try {
        setIsLoading(true);

        // とりあえずfalseを送る
        const res = await getPhotoAdvice(uri, false);

        setAdvice(res.advice);
        // とりあえず先頭だけ使う
        setVisualCue(res.visual_cues?.[0] ?? null);
      } catch (error) {
        console.error(error);
        setAdvice("アドバイスの取得に失敗しました。時間をおいて再度お試しください。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvice();
  }, [uri]);

  // 画像保存
  function savePhoto() {
    if (!uri) return;
    MediaLibrary.saveToLibraryAsync(uri);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 画像プレビュー */}
      <View className="flex-1 items-center justify-center">
        {uri ? (
          <View className="w-[80%] h-[80%] relative">
            {/* 撮った画像 */}
            <Image
              source={{ uri }}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* 枠 */}
            <Animated.View
              className="absolute top-[20%] left-[15%] w-[70%] h-[60%] border-4 border-yellow-300 rounded-xl"
              style={boxStyle}
            />

            {/* 矢印 */}
            {!isDepth && (
              <Animated.Image
                source={ArrowImg}
                className="absolute w-20 h-20"
                style={[
                  {
                    tintColor: "lightblue",
                  },
                  arrowPositionStyle,
                  arrowStyle,
                ]}
                resizeMode="contain"
              />
            )}
          </View>
        ) : (
          <Text className="text-black">画像がありません</Text>
        )}
      </View>

      {/* アドバイス表示 */}
      {isLoading ? (
        <Text className="text-gray-500">AIが写真を解析中です...</Text>
      ) : (
        <Text className="text-red-500">{advice}</Text>
      )}

      {/* ボタン表示 */}
      <View className="flex-row p-5 gap-3 justify-center">
        <Button
          text="撮影に戻る"
          onPress={() => router.back()}
          color="cancel"
        />
        <Button
          text="保存する"
          onPress={savePhoto}
        />
      </View>
    </SafeAreaView>
  );
}
