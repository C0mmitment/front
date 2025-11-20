import React from "react";
import { Pressable, Text } from "react-native";
import { cva } from "class-variance-authority";

interface ButtonProps {
  onPress: () => void;
  text: string;
  color?: "default" | "cancel";
  size?: "sm" | "md" | "lg";
}

const buttonStyles = cva(
  "rounded-lg items-center justify-center", // ← 中央揃え
  {
    variants: {
      color: {
        default: "bg-black web:hover:bg-gray-700 native:active:bg-gray-700",
        cancel: "bg-white web:hover:bg-gray-100 native:active:bg-gray-100 border",
      },
      size: {
        sm: "px-4 py-2 w-28",
        md: "px-6 py-3 w-40",
        lg: "px-8 py-4 w-52",
      },
    },
    defaultVariants: {
      color: "default",
      size: "md",
    },
  }
);

const textStyles = cva(
  "font-bold",
  {
    variants: {
      color: {
        default: "text-white",
        cancel: "text-black",
      },
      size: {
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
      },
    },
    defaultVariants: {
      color: "default",
      size: "md",
    },
  }
);

export const Button = ({
  onPress,
  text,
  color = "default",
  size = "md",
}: ButtonProps) => {
  return (
    <Pressable className={buttonStyles({ color, size })} onPress={onPress}>
      <Text className={textStyles({ color, size })}>{text}</Text>
    </Pressable>
  );
};
