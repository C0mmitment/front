import { useRef, useState, useCallback } from "react"; // useCallbackを追加
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import type { CameraMode } from "../types/camera";

export function useCameraActions() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [zoom, setZoom] = useState(0);

  // ズーム値を更新する関数
  const updateZoom = useCallback((currentScale: number, base: number) => {
    let nextZoom = base + (currentScale - 1) * 0.5;
    
    const MAX_ZOOM_LIMIT = 0.3; 
    
    nextZoom = Math.max(0, Math.min(nextZoom, MAX_ZOOM_LIMIT));
    
    setZoom(nextZoom);
    return nextZoom; 
  }, []);

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
    setZoom(0); // カメラ切り替え時にズームをリセット
  }

  return {
    cameraRef,
    facing,
    zoom,
    updateZoom,
    takePicture,
    openPhotoFolder,
    toggleCameraFacing,
  };
}
