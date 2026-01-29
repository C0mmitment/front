// app/components/icon-button/icon-button.tsx
import { Pressable, Text, View } from "react-native";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
};

export default function IconButton({ icon, label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-col items-center gap-3">
      <View className="w-16 h-16 items-center justify-center border-2 border-primary rounded-full">
        {icon}
      </View>
      <Text className="text-secondary">{label}</Text>
    </Pressable>
  );
}
