import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
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
        <Pressable
          className="flex-col items-center gap-3"
          onPress={() => {console.log("AIに聞く")}}
        >
          <View className="w-16 h-16 items-center justify-center border-2 border-primary rounded-full">
            <FontAwesome6 name="robot" size={28} color="#FF73EF" />
          </View>
          <Text className="text-secondary">AIに聞く</Text>
        </Pressable>

        {/* 共有するボタン */}
        <Pressable
          className="flex-col items-center gap-3"
          onPress={shareImage}
        >
          <View className="w-16 h-16 items-center justify-center border-2 border-primary rounded-full">
            <FontAwesome6 name="share-nodes" size={28} color="#FF73EF" />
          </View>
          <Text className="text-secondary">共有する</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
