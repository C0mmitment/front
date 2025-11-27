import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "../components/Button/Button";
import { useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function AdvicePage() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [advice, setAdvice] = useState<string>("ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。");

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
          <View
            style={{
              width: "80%",
              height: "80%",
              position: "relative",  // ← これで重ねられる
            }}
          >
            {/* 枠組み */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: "20%",
                  left: "15%",
                  width: "70%",
                  height: "60%",
                  borderWidth: 4,
                  borderColor: "yellow",
                  borderRadius: 12,
                  zIndex: 10,
                },
                boxStyle,
              ]}
            />
            {/* 撮った画像 */}
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            {/* 矢印 */}
            <Animated.Text
              style={[
                {
                  position: "absolute",
                  left: 10,       // 右側に固定
                  top: "50%",      // 高さは中央
                  transform: [{ translateY: -12 }],
                  fontSize: 40,
                  color: "yellow",
                  fontWeight: "bold",
                  textShadowColor: "rgba(0,0,0,0.5)",
                  textShadowRadius: 4,
                },
                arrowStyle,        // ← アニメーション
              ]}
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
      <View style={{ flexDirection: 'row', padding: 20, gap: 12, justifyContent: 'center' }}>
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
