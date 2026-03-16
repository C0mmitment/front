import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { getTips } from '../(features)/home/api/tips-api';

import type { Tips } from '../types/tips';

type TipsContextType = {
  tips: Tips[];
  getRandomTip: () => Tips | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const TipsContext = createContext<TipsContextType | undefined>(undefined);

export function TipsProvider({ children }: { children: React.ReactNode }) {
  const [tips, setTips] = useState<Tips[]>([
    {
      tips_id: '',
      title: 'ここはなに？',
      category: 'app',
      content: '撮影やアプリに関する豆知識が表示されるよ。',
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // StrictMode 再マウント対策
  const fetchedRef = useRef(false);

  const fetchTips = async (force = false) => {
    if (!force && fetchedRef.current) return;
    fetchedRef.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const tipsList = await getTips();
      setTips(tipsList);
    } catch {
      setError('Tipsの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const getRandomTip = (): Tips | null => {
    if (tips.length === 0) return null;
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <TipsContext.Provider
      value={{
        tips,
        getRandomTip,
        isLoading,
        error,
        refetch: async () => {
          await fetchTips(true);
        },
      }}
    >
      {children}
    </TipsContext.Provider>
  );
}

export function useTips() {
  const context = useContext(TipsContext);

  if (!context) {
    throw new Error('useTips must be used within a TipsProvider');
  }

  return context;
}
