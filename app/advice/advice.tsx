import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Button } from "../components/Button/Button";
import { getPhotoAdvice } from "../api/advice-api";

export default function AdvicePage() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [advice, setAdvice] = useState<string>("ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。");
  const [isLoading, setIsLoading] = useState(false); // ローディング中なんか表示する用

  // アニメーション用変数
  const arrowX = useSharedValue(0);       // 矢印（Ⅹ軸）
  const boxOpacity = useSharedValue(0.6); // 枠組み

  useEffect(() => {
    // 矢印
    arrowX.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 400 }), // 左へ動かす
        withTiming(0, { duration: 400 })    // 中央へ戻る
      ),
      -1, // 無限ループ
      true
    );

    // 枠組み
    boxOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 500 }),
        withTiming(0.7, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  // 矢印のスタイル
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: arrowX.value }, // 左右に揺れる
      { translateY: -12 },          // 中央から少し上にズラす
    ],
  }));

  // 枠スタイル（点滅）
  const boxStyle = useAnimatedStyle(() => ({
    opacity: boxOpacity.value,
  }));

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
            {/* 枠組み */}
            <Animated.View
              className="absolute top-[20%] left-[15%] w-[70%] h-[60%] border-4 border-yellow-300 rounded-xl z-10"
              style={boxStyle}
            />
            {/* 矢印 */}
            <Animated.Text
              className="absolute left-2 top-1/2 text-[40px] text-yellow-300 font-bold"
              style={arrowStyle}
            >
              ←
            </Animated.Text>
          </View>
        ) : (
          <Text className="text-black">画像がありません</Text>
        )}
      </View>

      {/* アドバイス表示 */}
      <View className="items-center px-8">
        <Text className="text-red-500">{advice}</Text>
      </View>

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
