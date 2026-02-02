// app/components/icon-button/icon-button.tsx
import { ReactNode } from 'react';

import { Pressable, Text, View } from 'react-native';

type Props = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
};

export default function IconButton({ icon, label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-col items-center gap-3">
      <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-primary">
        {icon}
      </View>
      <Text className="text-secondary">{label}</Text>
    </Pressable>
  );
}
