import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomePage() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // カメラの権限がない場合の表示
  if (!permission) return <View className="flex-1 bg-black" />;
  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg mb-4">
          カメラを使用するための権限が必要です
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-xl"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-base">権限を許可する</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 写真フォルダを開く関数
  function openPhotoFolder() {
    console.log("Open photo folder");
  }

  // 写真を端末に保存する関数
  async function takePicture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: true,
      exif: true,
    });
    console.log(photo.uri);
  }

  // カメラの向きを切り替える関数
  function toggleCameraFacing() {
    setFacing((cur) => (cur === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      {/* nativewindが効かないためstyle適用 */}
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
        <TouchableOpacity className="w-15 items-center mx-3" onPress={openPhotoFolder}>
          <FontAwesome name="picture-o" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="w-15 items-center mx-3" onPress={takePicture}>
          <FontAwesome6 name="circle" size={60} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="w-15 items-center mx-3" onPress={toggleCameraFacing}>
          <FontAwesome6 name="camera-rotate" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
