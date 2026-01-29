import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as MediaLibrary from 'expo-media-library';
import Animated from "react-native-reanimated";
import { getPhotoAdvice } from "../api/advice-api";
import type { VisualCue } from "../api/advice-api";
import { usePhotoAdviceVisuals } from "../hooks/usePhotoAdviceVisuals";
import ArrowImg from "./assets/arrow.png";
import type { CameraMode } from "../types/camera";
import PhotoTips from "../components/Tips/tips";
import IconButton from "../components/icon-button/icon-button";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';

export default function AdvicePage() {
  const { uri, mode } = useLocalSearchParams<{
    uri: string;
    mode: CameraMode;
  }>();
  const [advice, setAdvice] = useState<string>("ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。");
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);

  const showVisuals = !isLoading && !!visualCue;

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

        // 現在地取得許可(とりあえずtrue)
        const gathering = true;

        // 緯度経度
        let loc: { lat: number; lon: number } | null = null;

        // 現在地取得許可が出てれば
        if (gathering) {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          loc = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
        } else {
          loc = null;
        }
      }

        const res = await getPhotoAdvice(uri, gathering, loc, mode);
        setAdvice(res.analysis.advice);
        // とりあえず先頭だけ使う
        setVisualCue(res.analysis.visual_cues?.[0] ?? null);
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
      <View className="m-4">
        {isLoading ? (
          <PhotoTips />
        ) : (
          <Text className="text-red-500">{advice}</Text>
        )}
      </View>
      
      {/* ボタン表示 */}
      <View className="flex-row p-5 gap-8 justify-center">
        {/* 撮影に戻るボタン */}
        <IconButton
          icon={<FontAwesome6 name="arrow-left" size={28} color="#FF73EF" />}
          label="撮影に戻る"
          onPress={() => router.back()}
        />
        {/* 保存するボタン */}
        <IconButton
          icon={<Feather name="download" size={28} color="#FF73EF" />}
          label="保存する"
          onPress={savePhoto}
        />
        {/* 共有するボタン */}
        <IconButton
          icon={<FontAwesome6 name="share-nodes" size={28} color="#FF73EF" />}
          label="共有する"
          onPress={() => console.log("共有する")}
        />
      </View>
    </SafeAreaView>
  );
}
