import { useEffect, useState, useCallback } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Crypto from 'expo-crypto';

const KEY = 'app.install_uuid';

export function useAppUuid() {
  const [uuid, setUuid] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadOrCreate = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(KEY);
      console.log('stored:', stored);
      if (stored) {
        setUuid(stored);
        return stored;
      }

      const created = Crypto.randomUUID();
      console.log('created:', created);
      await AsyncStorage.setItem(KEY, created);
      setUuid(created);
      return created;
    } catch (e) {
      console.log('uuid init error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    void loadOrCreate();
  }, [loadOrCreate]);

  return { uuid, isLoaded, reload: loadOrCreate };
}
