// app/hooks/useCameraActions.ts
import { useRef, useState } from "react";
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import type { CameraMode } from "../types/camera";

export function useCameraActions() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");

  // 写真撮影
  async function takePicture(mode: CameraMode) {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: true,
      exif: true,
    });

    router.push({
      pathname: "/advice/advice",
      params: { 
        uri: photo.uri,
        mode: mode,
      },
    });
  }

  // アルバムを開く
  async function openPhotoFolder() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  // カメラ切り替え
  function toggleCameraFacing() {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  return {
    cameraRef,
    facing,
    takePicture,
    openPhotoFolder,
    toggleCameraFacing,
  };
}
