// app/advice/components/photo-tips.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";

type Tip = {
  title: string;
  advice: string;
  image: any;
};

type PhotoTipsProps = {
  className?: string; // 外部からclassNameを受け取れるように
};

export default function PhotoTips({ className = "" }: PhotoTipsProps) {
  const tips: Tip = {
    title: "人を撮るときのワンポイント",
    advice: "人物を撮るときは、スマホを少し上向きに傾けてみましょう。長めの文章でも折り返されるようになります。",
    image: require("../../../assets/photo-tips-sample.png"),
  };

  // ローディング用アニメーション
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 900,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className={className}>
      <View className="bg-white rounded-lg p-4 shadow-md">
        <Text className="text-lg font-bold">Tips</Text>
        <View className="flex-row mt-2">
          <Image
            source={tips.image}
            className="w-28 h-28 rounded-md"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4">
            <Text className="font-semibold mb-2">{tips.title}</Text>
            <Text className="text-gray-400 mb-2">{tips.advice}</Text>
          </View>
        </View>

        {/* ローディング表示 */}
        <Animated.Text
          style={{ opacity }}
          className="text-center text-blue-500 mt-2 font-semibold"
        >
          AIが写真を解析中…
        </Animated.Text>
      </View>
    </View>
  );
}
