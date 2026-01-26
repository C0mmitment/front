import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "app.hasSeenPermissionPrompt";

export function useFirstLaunchFlag() {
  const [hasSeen, setHasSeen] = useState<boolean>(true); // 読み込み前の誤表示を防ぐためtrue
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        // 未保存(null)なら「初回」= hasSeen false
        setHasSeen(v === "1");
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const markSeen = useCallback(async () => {
    setHasSeen(true);
    await AsyncStorage.setItem(KEY, "1");
  }, []);

  return { hasSeen, isLoaded, markSeen };
}
