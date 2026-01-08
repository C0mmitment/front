import uuid from 'react-native-uuid';
import * as ImageManipulator from 'expo-image-manipulator';
import clientApi from "./client-api";
import axios from "axios";

// 視覚的なアドバイス
export type VisualCue = {
  target: "camera";
  direction: "left" | "right" | "up" | "down" | "up_left" | "up_right" | "down_left" | "down_right" | "forward" | "backward"; // 矢印の方向
};

// アドバイス
export type PhotoAdviceResponse = {
  analysis: any;
  advice: string;
  visual_cues: VisualCue[];
};

// 緯度経度
type LocationPayload = { lat: number; lon: number } | null;

export async function getPhotoAdvice(imageUri: string, gathering: boolean = false, location: LocationPayload): Promise<PhotoAdviceResponse> {

  const targetSize = 1024; // 変換サイズ
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    // リサイズ
    [{ resize: { width: targetSize, height: targetSize } }],
    // JPEG、品質80%
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG
    }
  );

  // URIを処理後のものに置き換える
  const manipulatedUri = manipResult.uri;
  const mimeType = 'image/jpeg';
  const fileName = 'upload.jpg';


  const formData = new FormData();

  // 画像
  formData.append("photo", {
    uri: manipulatedUri,
    name: fileName,
    type: mimeType,
  } as any);

  // 追加したいフィールド
  formData.append("uuid", String(uuid.v4()));                 // uuid
  formData.append("gathering", gathering ? "true" : "false"); // 現在地の利用許可
  formData.append("category", "person");                      // カテゴリー
  if (gathering && location) {                                // 現在地
    formData.append("lat", String(location.lat));
    formData.append("long", String(location.lon));
  }

  try {
    const res = await axios.post("http://10.200.2.92:3535/api/v1/middle/advice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("=== Axios Network Error ===");
      console.log("message:", err.message);
      console.log("code:", err.code);
      console.log("baseURL:", err.config?.baseURL);
      console.log("url:", err.config?.url);
      console.log(imageUri);
    } else {
      console.log("Unknown error:", err);
    }
    throw err;
  }

}
