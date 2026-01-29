import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "../components/Button/Button";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import { getPhotoAdvice } from "../api/advice-api";
import type { VisualCue } from "../api/advice-api";
import PhotoTips from "../components/Tips/tips";

export default function PhotoSelectedPage() {
  const [advice, setAdvice] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [ratio, setRatio] = useState<number>(1);

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

      <View className="flex-1 items-center justify-center">
        {uri ? (
          <View className="w-full overflow-hidden " style={{ aspectRatio: ratio }}>
            <Image source={{ uri }} className="w-full h-full" resizeMode="contain" />
          </View>
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
      <View className="flex flex-row p-5 gap-3 justify-center">
        <Button text="AIに聞く" onPress={fetchAdvice} />
        <Button text="共有する" onPress={shareImage} />
      </View>
    </SafeAreaView>
  );
}
