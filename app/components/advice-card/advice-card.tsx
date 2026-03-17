import React from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { View, Text } from 'react-native';

import type { AdviceStatus } from '@/types/advice';

type AdviceCardProps = {
  advice: string;
  status?: AdviceStatus;
  className?: string;
};

const STATUS_CONFIG: Record<
  AdviceStatus,
  {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
  }
> = {
  improved: {
    icon: 'emoticon-happy-outline',
    color: '#66BB6A',
  },
  unchanged: {
    icon: 'emoticon-neutral-outline',
    color: '#9E9E9E',
  },
  regressed: {
    icon: 'emoticon-sad-outline',
    color: '#E57373',
  },
  first_time: {
    icon: 'emoticon-outline',
    color: '#64B5F6',
  },
};

export default function AdviceCard({ advice, status = 'first_time', className }: AdviceCardProps) {
  console.log('AdviceCard status:', status);

  const { icon, color } = STATUS_CONFIG[status];

  return (
    <View className={className}>
      <View className="rounded-lg bg-white p-4 shadow-md">
        <View className="mt-2 flex-row items-start">
          <MaterialCommunityIcons name={icon} size={32} color={color} />

          <View className="ml-4 flex-1">
            <Text className="mb-2 font-semibold">{advice}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
