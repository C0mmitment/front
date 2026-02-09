import React, { useEffect, useMemo } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';

import { View, Text, Animated, Easing } from 'react-native';

import type { TipsCategory } from '../../types/tips';

type PhotoTipsProps = {
  title: string;
  content: string;
  category: TipsCategory;
  className?: string;
};

export default function PhotoTips({ title, content, category, className = '' }: PhotoTipsProps) {
  const categoryIconMap: Record<TipsCategory, keyof typeof Ionicons.glyphMap> = {
    photo: 'camera-outline',
    app: 'bulb-outline',
    dev: 'chatbubble-ellipses-outline',
    other: 'cube-outline',
  };

  // ローディング用アニメーション
  const opacity = useMemo(() => new Animated.Value(0.3), []);

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
  }, [opacity]);

  return (
    <View className={className}>
      <View className="rounded-lg bg-white p-4 shadow-md">
        <Text className="text-lg font-bold">Tips</Text>

        <View className="mt-2 flex-row items-start">
          <Ionicons name={categoryIconMap[category]} size={28} color="black" />

          <View className="ml-4 flex-1">
            <Text className="mb-2 font-semibold">{title}</Text>
            <Text className="mb-2 text-gray-400">{content}</Text>
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
