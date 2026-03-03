import { useState, useEffect, useRef } from 'react';

import * as FileSystem from 'expo-file-system/legacy';

import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';

import { useLocationSetting } from './useLocationSetting';
import { getPhotoAdvice, type VisualCue } from '../api/advice-api';
import { useCompare } from '../contexts/compare-context';

import type { AdviceStatus } from '../types/advice';
import type { CameraMode } from '../types/camera';

export function useAdvicePageData(uri: string | undefined, mode: CameraMode) {
  const [advice, setAdvice] = useState('ここにAIからのアドバイスが表示されます...');
  const [status, setStatus] = useState<AdviceStatus>('first_time');
  const [isLoading, setIsLoading] = useState(false);
  const [visualCue, setVisualCue] = useState<VisualCue | null>(null);
  const lastAnalysisRef = useRef<any>(null);

  const { locationEnabled, isLoaded: isLocationLoaded } = useLocationSetting();
  const { enabled: compareEnabled, preAnalysis, startCompare, clearCompare } = useCompare();

  const fetchAdvice = async () => {
    if (!uri || !isLocationLoaded) return;
    try {
      setIsLoading(true);
      let loc = null;
      if (locationEnabled) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        }
      }

      const res = await getPhotoAdvice(
        uri,
        locationEnabled,
        loc,
        mode,
        compareEnabled ? preAnalysis : undefined,
      );
      if (compareEnabled) clearCompare();

      setAdvice(res.analysis.advice);
      setStatus(res.analysis.evaluate);
      setVisualCue(res.analysis.visual_cues?.[0] ?? null);
      lastAnalysisRef.current = res.analysis;
    } catch (error) {
      console.error(error);
      setAdvice('アドバイスの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [uri, mode, isLocationLoaded]);

  const handleCompare = () => {
    if (!lastAnalysisRef.current) return;
    startCompare(lastAnalysisRef.current);
    router.push('/home');
  };

  const handleSave = async () => {
    if (!uri) return;
    await MediaLibrary.saveToLibraryAsync(uri);
    router.back();
  };

  const handleShare = async () => {
    if (!uri) return;
    await MediaLibrary.saveToLibraryAsync(uri);
    const tempPath = `${FileSystem.cacheDirectory}shared-image.jpg`;
    await FileSystem.copyAsync({ from: uri, to: tempPath });
    await Sharing.shareAsync(tempPath);
  };

  return { advice, status, isLoading, visualCue, handleCompare, handleSave, handleShare };
}
