import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "../components/Button/Button";
import { useState } from "react";
import * as MediaLibrary from 'expo-media-library';

export default function AdvicePage() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [advice, setAdvice] = useState<string>("ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。ここにAIからのアドバイスが表示されます。");

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
          <Image
            source={{ uri }}
            style={{ width: "80%", height: "80%" }}
            resizeMode="cover"
          />
        ) : (
          <Text className="text-black">画像がありません</Text>
        )}
      </View>

      {/* アドバイス表示 */}
      <View className="items-center px-8">
        <Text className="text-red-500">{advice}</Text>
      </View>

      {/* ボタン表示 */}
      <View style={{flexDirection: 'row', padding: 20, gap: 12, justifyContent: 'center'}}>
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
