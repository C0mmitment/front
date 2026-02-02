import { useEffect } from 'react';

import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { VisualCue } from '../api/advice-api';

type Direction = VisualCue['direction'];

// 将来拡張できるように
type Options = {
  direction?: Direction;
};

type PositionValue = number | 'auto' | `${number}%`;

type PositionStyle = {
  top?: PositionValue;
  bottom?: PositionValue;
  left?: PositionValue;
  right?: PositionValue;
};

const DIRECTION_CONFIG: Record<
  Direction,
  {
    dx: number; // X方向の揺れ幅
    dy: number; // Y方向の揺れ幅
    isDepth?: boolean; // forward/backward かどうか
    scaleTarget?: number; // 拡大縮小アニメの目標値
    rotation: string; // 矢印画像の回転角度
    position: PositionStyle; // 矢印の位置
  }
> = {
  left: { dx: -10, dy: 0, rotation: '180deg', position: { left: 8, top: '50%' } },
  right: { dx: 10, dy: 0, rotation: '0deg', position: { right: 8, top: '50%' } },
  up: { dx: 0, dy: -10, rotation: '-90deg', position: { top: '2%', left: '40%' } },
  down: { dx: 0, dy: 10, rotation: '90deg', position: { bottom: '2%', left: '40%' } },
  up_left: { dx: -8, dy: -8, rotation: '-135deg', position: { top: '2%', left: 8 } },
  up_right: { dx: 8, dy: -8, rotation: '-45deg', position: { top: '2%', right: 8 } },
  down_left: { dx: -8, dy: 8, rotation: '135deg', position: { bottom: '2%', left: 8 } },
  down_right: { dx: 8, dy: 8, rotation: '45deg', position: { bottom: '2%', right: 8 } },
  forward: {
    dx: 0,
    dy: 0,
    isDepth: true,
    scaleTarget: 1.1,
    rotation: '0deg',
    position: { left: '50%', top: '50%' },
  },
  backward: {
    dx: 0,
    dy: 0,
    isDepth: true,
    scaleTarget: 0.9,
    rotation: '0deg',
    position: { left: '50%', top: '50%' },
  },
};

export function usePhotoAdviceVisuals(options: Options = {}) {
  const { direction } = options;
  const dir: Direction = direction ?? 'left';
  const config = DIRECTION_CONFIG[dir];

  const arrowX = useSharedValue(0);
  const arrowY = useSharedValue(0);
  const boxOpacity = useSharedValue(0.6);
  const boxScale = useSharedValue(1);

  // 方向に応じたアニメーション
  useEffect(() => {
    if (config.isDepth) {
      // forward / backward: 枠の拡大縮小
      arrowX.value = 0;
      arrowY.value = 0;

      boxScale.value = withRepeat(
        withSequence(
          withTiming(config.scaleTarget ?? 1, { duration: 400 }),
          withTiming(1, { duration: 400 }),
        ),
        -1,
        true,
      );
    } else {
      // 平面方向: 矢印の揺れ
      boxScale.value = 1;

      arrowX.value = withRepeat(
        withSequence(withTiming(config.dx, { duration: 400 }), withTiming(0, { duration: 400 })),
        -1,
        true,
      );

      arrowY.value = withRepeat(
        withSequence(withTiming(config.dy, { duration: 400 }), withTiming(0, { duration: 400 })),
        -1,
        true,
      );
    }
  }, [dir]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: arrowX.value },
      { translateY: arrowY.value },
      { rotate: config.rotation },
    ],
  }));

  const boxStyle = useAnimatedStyle(() => ({
    opacity: boxOpacity.value,
    transform: [{ scale: boxScale.value }],
  }));

  const arrowPositionStyle: PositionStyle = config.position;

  return {
    arrowStyle,
    arrowPositionStyle,
    boxStyle,
    isDepth: !!config.isDepth,
  };
}
