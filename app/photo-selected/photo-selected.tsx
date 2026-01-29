import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import IconButton from "../components/icon-button/icon-button";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

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

      <View className="flex flex-row p-5 gap-10 justify-center">
        {/* AIに聞くボタン */}
        <IconButton
          icon={<FontAwesome6 name="robot" size={28} color="#FF73EF" />}
          label="AIに聞く"
          onPress={() => console.log("AIに聞く")}
        />

        {/* 共有するボタン */}
        <IconButton
          icon={<FontAwesome6 name="share-nodes" size={28} color="#FF73EF" />}
          label="共有する"
          onPress={shareImage}
        />
      </View>
    </SafeAreaView>
  );
}
