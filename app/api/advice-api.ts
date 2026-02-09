// app/api/advice-api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import * as ImageManipulator from 'expo-image-manipulator';

import clientApi from './client-api';

import type { CameraMode } from '../types/camera';

// 視覚的なアドバイス
export type VisualCue = {
  target: 'camera';
  direction:
    | 'left'
    | 'right'
    | 'up'
    | 'down'
    | 'up_left'
    | 'up_right'
    | 'down_left'
    | 'down_right'
    | 'forward'
    | 'backward';
};

// アドバイス
export type PhotoAdviceResponse = {
  analysis: any;
  advice: string;
  visual_cues: VisualCue[];
};

// 緯度経度
type LocationPayload = { lat: number; lon: number } | null;

// uuidがない状態で送らないようにする用
const UUID_KEY = 'app.install_uuid';
async function getInstallUuid(): Promise<string> {
  const v = await AsyncStorage.getItem(UUID_KEY);
  if (!v) {
    throw new Error('install_uuid is not initialized. Call useAppUuid on app startup.');
  }
  return v;
}

export async function getPhotoAdvice(
  imageUri: string,
  gathering: boolean,
  location: LocationPayload,
  category: CameraMode,
  preAnalysis?: any,
): Promise<PhotoAdviceResponse> {
  const installUuid = await getInstallUuid();
  const targetSize = 1024; // 変換サイズ
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    // リサイズ
    [{ resize: { width: targetSize, height: targetSize } }],
    // JPEG、品質80%
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
  );

  // URIを処理後のものに置き換える
  const manipulatedUri = manipResult.uri;
  const mimeType = 'image/jpeg';
  const fileName = 'upload.jpg';

  const formData = new FormData();

  // 追加したいフィールド
  formData.append('uuid', installUuid); // uuid
  formData.append('gathering', gathering ? 'true' : 'false'); // 現在地の利用許可
  formData.append('category', category); // カテゴリー
  if (gathering && location) {
    // 現在地
    formData.append('lat', String(location.lat));
    formData.append('long', String(location.lon));
  }
  if (preAnalysis) {
    formData.append('pre_analysis', JSON.stringify(preAnalysis));
  }

  // 画像
  formData.append('photo', {
    uri: manipulatedUri,
    name: fileName,
    type: mimeType,
  } as any);

  try {
    const res = await clientApi.post('/analysis/advice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log('=== Axios Network Error ===');
      console.log('message:', err.message);
      console.log('code:', err.code);
      console.log('baseURL:', err.config?.baseURL);
      console.log('url:', err.config?.url);
      console.log(imageUri);
    } else {
      console.log('Unknown error:', err);
    }
    throw err;
  }
}
