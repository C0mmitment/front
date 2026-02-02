import { useEffect, useState, useCallback } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存キー
const KEY = 'settings.locationEnabled';

export function useLocationSetting() {
  const [locationEnabled, setLocationEnabled] = useState(false); // 現在地利用
  const [isLoaded, setIsLoaded] = useState(false); // ローディング用

  // 初回ロード
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        // データがあれば1(true)に変更
        if (saved !== null) setLocationEnabled(saved === '1');
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // 更新（保存込み）
  const updateLocationEnabled = useCallback(async (next: boolean) => {
    setLocationEnabled(next);
    await AsyncStorage.setItem(KEY, next ? '1' : '0');
  }, []);

  return { locationEnabled, setLocationEnabled: updateLocationEnabled, isLoaded };
}
