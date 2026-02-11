import { useState, useEffect, useMemo } from 'react';

import { Image, LayoutChangeEvent } from 'react-native';

export function useImageLayout(uri: string | undefined) {
  const [ratio, setRatio] = useState(1);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!uri) return;
    Image.getSize(
      uri,
      (w, h) => setRatio(w / h),
      () => setRatio(1),
    );
  }, [uri]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
  };

  const fittedSize = useMemo(() => {
    if (!box || !ratio) return null;
    let w = box.w;
    let h = box.w / ratio;
    if (h > box.h) {
      h = box.h;
      w = box.h * ratio;
    }
    return { w, h };
  }, [box, ratio]);

  return { onLayout, fittedSize };
}
