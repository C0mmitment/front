import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "../components/Button/Button";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

export default function PhotoSelectedPage() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

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

  return (
    <SafeAreaView className="flex-1 bg-white">

      <View className="flex-1 items-center justify-center">
        {uri ? (
          <View className="w-4/5 h-4/5 relative">
            <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
          </View>
        ) : (
          <Text className="text-black">画像がありません</Text>
        )}
      </View>

      <View className="flex flex-row p-5 gap-3 justify-center">
        <Button text="AIに聞く" onPress={() => console.log("click")} />
        <Button text="共有する" onPress={shareImage} />
      </View>
    </SafeAreaView>
  );
}
