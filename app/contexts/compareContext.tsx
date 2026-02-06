import React, { createContext, useContext, useMemo, useState } from 'react';

type CompareState = {
  enabled: boolean;
  preAnalysis: any | null;
  startCompare: (pre: any) => void;
  clearCompare: () => void;
};

const Ctx = createContext<CompareState | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [preAnalysis, setPreAnalysis] = useState<any | null>(null);

  const value = useMemo(
    () => ({
      enabled,
      preAnalysis,
      startCompare: (pre: any) => {
        setEnabled(true);
        setPreAnalysis(pre ?? null);
      },
      clearCompare: () => {
        setEnabled(false);
        setPreAnalysis(null);
      },
    }),
    [enabled, preAnalysis],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompare() {
  const v = useContext(Ctx);
  if (!v) throw new Error('CompareProviderが見つかりません');
  return v;
}
