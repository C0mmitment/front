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
import ArrowImg from "../../assets/arrow.png";
import type { CameraMode } from "../types/camera";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import PhotoTips from "../components/Tips/tips";
import IconButton from "../components/icon-button/icon-button";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import { colors } from "../constans/color";
import { useLocationSetting } from "../hooks/useLocationSetting";

export default function AdvicePage() {
  const { uri, mode } = useLocalSearchParams<{
    uri: string;
    mode: CameraMode;
  }>();
  const [advice, setAdvice] = useState<string>("ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。");
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);
  const [ratio, setRatio] = useState<number>(1);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  const { locationEnabled, isLoaded } = useLocationSetting();

  const showVisuals = !isLoading && !!visualCue;

  // directionをhookに渡す
  const { arrowStyle, arrowPositionStyle, boxStyle, isDepth } = usePhotoAdviceVisuals({
    direction: visualCue?.direction,
  });

  // 画像の縦横比を取得
  useEffect(() => {
    if (!uri) return;
    Image.getSize(
      uri,
      (w, h) => setRatio(w / h),
      () => setRatio(1)
    );
  }, [uri]);

  const fitted = (() => {
    if (!box || !ratio) return null;

    const W = box.w;
    const H = box.h;

    let w = W;
    let h = W / ratio;

    if (h > H) {
      h = H;
      w = H * ratio;
    }

    return { w, h };
  })();

  // アドバイス取得
  useEffect(() => {
    if (!uri) return;
    if (!isLoaded) return;

    const fetchAdvice = async () => {
      try {
        setIsLoading(true);

        // 現在地取得許可(とりあえずtrue)
        const gathering = locationEnabled;

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
  }, [uri, mode, locationEnabled, isLoaded]);

  // 画像保存
  function savePhoto() {
    if (!uri) return;
    MediaLibrary.saveToLibraryAsync(uri);
    router.back();
  }

  // 画像の保存と共有
  async function shareImage() {
    if (!uri) return;
    MediaLibrary.saveToLibraryAsync(uri);
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

  return (
    <SafeAreaView className="flex-1 bg-white">
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
              {/* 画像（切らない） */}
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
                  className="absolute w-20 h-20"
                  style={[{ tintColor: "lightblue" }, arrowPositionStyle, arrowStyle]}
                  resizeMode="contain"
                />
              )}
            </View>
          ) : null
        ) : (
          <Text className="text-black">画像がありません</Text>
        )}
      </View>

      {/* アドバイス表示 */}
      <View className="m-4">
        {isLoading ? <PhotoTips /> : <Text className="text-red-500">{advice}</Text>}
      </View>

      {/* ボタン表示 */}
      <View className="flex-row p-5 gap-8 justify-center">
        <IconButton
          icon={<FontAwesome6 name="arrow-left" size={28} color={colors.primary} />}
          label="撮影に戻る"
          onPress={() => router.back()}
        />
        <IconButton
          icon={<Feather name="download" size={28} color={colors.primary} />}
          label="保存する"
          onPress={savePhoto}
        />
        <IconButton
          icon={<FontAwesome6 name="share-nodes" size={28} color={colors.primary} />}
          label="保存して共有"
          onPress={shareImage}
        />
      </View>
    </SafeAreaView>
  );
}
