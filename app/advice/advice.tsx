import { useEffect, useState, useRef } from 'react';

import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system/legacy';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Image, Text, View, TouchableOpacity } from 'react-native';

import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';

import ArrowImg from '../../assets/arrow.png';
import { getPhotoAdvice } from '../api/advice-api';
import IconButton from '../components/icon-button/icon-button';
import PhotoTips from '../components/Tips/tips';
import { colors } from '../constans/color';
import { useLocationSetting } from '../hooks/useLocationSetting';
import { usePhotoAdviceVisuals } from '../hooks/usePhotoAdviceVisuals';

import type { VisualCue } from '../api/advice-api';
import type { CameraMode } from '../types/camera';

export default function AdvicePage() {
  const { uri, mode, compare, pre_analysis } = useLocalSearchParams<{
    uri: string;
    mode: CameraMode;
    compare?: string;
    pre_analysis?: string;
  }>();
  const [advice, setAdvice] = useState<string>(
    'ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);
  const [ratio, setRatio] = useState<number>(1);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const lastAnalysisRef = useRef<any | null>(null); // ← 前回のanalysis保持

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
      () => setRatio(1),
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
  const fetchAdvice = async () => {
    if (!uri) return;
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      const gathering = locationEnabled;

      let loc: { lat: number; lon: number } | null = null;

      if (gathering) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        }
      }

      console.log('compare:', compare);
      console.log('pre_analysis len:', pre_analysis?.length);
      try {
        const tmp = pre_analysis ? JSON.parse(pre_analysis) : null;
        console.log('pre_analysis parsed ok:', !!tmp);
      } catch (e) {
        console.log('pre_analysis parse failed:', String(e));
      }

      let pre: any | undefined = undefined;
      if (compare === '1' && pre_analysis) {
        try {
          pre = JSON.parse(pre_analysis);
        } catch {
          pre = undefined;
        }
      }

      const res = await getPhotoAdvice(uri, gathering, loc, mode, pre);

      setAdvice(res.analysis.advice);
      setVisualCue(res.analysis.visual_cues?.[0] ?? null);

      lastAnalysisRef.current = res.analysis;
      console.log(lastAnalysisRef);

      if (compare === '1') {
        router.replace({
          pathname: '/advice/advice',
          params: { uri, mode },
        });
      }
    } catch (error) {
      console.error(error);
      setAdvice('アドバイスの取得に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!uri) return;
    if (!isLoaded) return;
    fetchAdvice();
  }, [uri, mode, locationEnabled, isLoaded]);

  // 比較撮影
  function comparePhoto() {
    const pre = lastAnalysisRef.current;

    router.push({
      pathname: '/home',
      params: {
        compare: '1', // 比較撮影フラグ
        pre_analysis: pre ? JSON.stringify(pre) : '', // 初回は空
      },
    });
  }

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
      const tempPath = FileSystem.cacheDirectory! + 'shared-image.jpg';

      await FileSystem.copyAsync({
        from: uri,
        to: tempPath,
      });

      await Sharing.shareAsync(tempPath);
    } catch (error) {
      console.log('Share error:', error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 上部 UI */}
      <View className="flex-row items-center justify-start bg-white px-4 py-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={colors.secondary} />
        </TouchableOpacity>
      </View>

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
              <Image source={{ uri }} className="h-full w-full" resizeMode="contain" />

              {/* 枠 */}
              {showVisuals && isDepth && (
                <Animated.View
                  className="absolute left-[15%] top-[20%] h-[60%] w-[70%] rounded-xl border-4 border-yellow-300"
                  style={boxStyle}
                />
              )}

              {/* 矢印 */}
              {showVisuals && !isDepth && (
                <Animated.Image
                  source={ArrowImg}
                  className="absolute h-20 w-20"
                  style={[{ tintColor: 'lightblue' }, arrowPositionStyle, arrowStyle]}
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
      <View className="flex-row justify-center gap-8 p-5">
        <IconButton
          icon={
            <MaterialCommunityIcons name="camera-retake-outline" size={28} color={colors.primary} />
          }
          label="比較撮影"
          onPress={comparePhoto}
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
