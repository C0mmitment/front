// app/advice/components/photo-tips.tsx
import React, { useEffect, useRef } from 'react';

import { View, Text, Image, Animated, Easing } from 'react-native';

type Tip = {
  title: string;
  advice: string;
  image: any;
};

type PhotoTipsProps = {
  className?: string; // 外部からclassNameを受け取れるように
};

export default function PhotoTips({ className = '' }: PhotoTipsProps) {
  const tips: Tip = {
    title: '人を撮るときのワンポイント',
    advice:
      '人物を撮るときは、スマホを少し上向きに傾けてみましょう。長めの文章でも折り返されるようになります。',
    image: require('../../../assets/photo-tips-sample.png'),
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
      ]),
    ).start();
  }, []);

  return (
    <View className={className}>
      <View className="rounded-lg bg-white p-4 shadow-md">
        <Text className="text-lg font-bold">Tips</Text>
        <View className="mt-2 flex-row">
          <Image source={tips.image} className="h-28 w-28 rounded-md" resizeMode="cover" />
          <View className="ml-4 flex-1">
            <Text className="mb-2 font-semibold">{tips.title}</Text>
            <Text className="mb-2 text-gray-400">{tips.advice}</Text>
          </View>
        </View>

        {/* ローディング表示 */}
        <Animated.Text style={{ opacity }} className="mt-2 text-center font-semibold text-blue-500">
          AIが写真を解析中…
        </Animated.Text>
      </View>
    </View>
  );
}
