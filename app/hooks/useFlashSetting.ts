import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type FlashMode = 'off' | 'on' | 'auto';

export function useFlashSetting() {
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回ロード
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('camera_flash');
        if (saved === 'on' || saved === 'off' || saved === 'auto') {
          setFlash(saved);
        }
      } catch (e) {
        console.log('flash load error', e);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  // 変更時保存
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('camera_flash', flash).catch((e) => console.log('flash save error', e));
  }, [flash, isLoaded]);

  return { flash, setFlash, isLoaded };
}
