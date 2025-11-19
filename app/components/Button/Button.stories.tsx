import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { View } from "react-native";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    text: "確定",
    onPress: () => alert("Button pressed!"),
    color: "default",
    size: "md",
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Cancel: Story = {
  args: {
    text: "キャンセル",
    color: "cancel",
  },
};

export const Small: Story = {
  args: {
    text: "小サイズ",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    text: "大サイズ",
    size: "lg",
  },
};

export const CancelLarge: Story = {
  args: {
    text: "戻る",
    color: "cancel",
    size: "lg",
  },
};
