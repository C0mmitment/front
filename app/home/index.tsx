import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomePage() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  // 権限チェック
  if (!permission) return <View className="flex-1 bg-black" />;
  if (!permission.granted) {
    Alert.alert(
      '"TotteMe!"がカメラへのアクセスを求めています。',
      "",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "許可する",   onPress: () => requestPermission(),
        },
      ]
    );
    return <View className="flex-1 bg-black" />;
  }

  // 写真フォルダを開く
  async function openPhotoFolder() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      router.push({
        pathname: "/photo-selected/photo-selected",
        params: { uri },
      });
    }
  }

  // 写真撮影
  async function takePicture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: true,
      exif: true,
    });
    console.log(photo.uri);
    router.push({
      pathname: "/advice/advice",
      params: { uri: photo.uri },
    });
  }

  // カメラ切り替え
  function toggleCameraFacing() {
    setFacing((cur) => (cur === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

      {/* ボタン UI */}
      <View
        style={{
          position: 'absolute',
          bottom: 32,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingVertical: 20,
          gap: 60,
        }}
      >
        {/* 画像アイコン */}
        <TouchableOpacity className="w-15 items-center mx-3" onPress={openPhotoFolder}>
          <FontAwesome name="picture-o" size={32} color="black" />
        </TouchableOpacity>
        {/* シャッターアイコン */}
        <TouchableOpacity className="w-15 items-center mx-3" onPress={takePicture}>
          <FontAwesome6 name="circle" size={60} color="black" />
        </TouchableOpacity>
        {/* 内外切り替えアイコン */}
        <TouchableOpacity className="w-15 items-center mx-3" onPress={toggleCameraFacing}>
          <FontAwesome6 name="camera-rotate" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
