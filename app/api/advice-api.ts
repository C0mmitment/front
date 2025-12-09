import uuid from 'react-native-uuid';
import clientApi from "./client-api";

// 視覚的なアドバイス
export type VisualCue = {
  target: "camera";
  direction: "left" | "right" | "up" | "down" |"up_left" | "up_right" | "down_left" | "down_right" | "forward" | "backward"; // 矢印の方向
};

// アドバイス
export type PhotoAdviceResponse = {
  advice: string;
  visual_cues: VisualCue[];
};

export async function getPhotoAdvice(imageUri: string, gathering: boolean = false): Promise<PhotoAdviceResponse> {
  const formData = new FormData();

  // 画像
  formData.append("photo", {
    uri: imageUri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as any);

  // 追加したいフィールド
  formData.append("uuid", uuid.v4());                         // uuid
  formData.append("gathering", gathering ? "true" : "false"); // 現在地の利用許可
  formData.append("category", "person");                      // カテゴリー

  const res = await clientApi.post<PhotoAdviceResponse>("/middle/advice",formData);

  return res.data;
}
