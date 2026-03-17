import { View } from 'react-native';

import AdviceCard from '@/components/advice-card/advice-card';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AdviceCard> = {
  title: 'Components/AdviceCard',
  component: AdviceCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#ffffff', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AdviceCard>;

export const Improved: Story = {
  name: '改善',
  args: {
    advice:
      '写真の構図が良くなりました！被写体が中央に配置されており、全体のバランスが取れています。',
    status: 'improved',
  },
};

export const Unchanged: Story = {
  name: '変化なし',
  args: {
    advice: '前回と同じ構図です。安定していますが、少し角度を変えてみるのも良いかもしれません。',
    status: 'unchanged',
  },
};

export const Regressed: Story = {
  name: '悪化',
  args: {
    advice: '被写体がフレームの端に寄りすぎています。中央寄りに配置すると見やすくなります。',
    status: 'regressed',
  },
};

export const FirstTime: Story = {
  name: '初回',
  args: {
    advice: 'はじめての撮影ですね！まずは被写体を画面の中央に置くことを意識してみましょう。',
    status: 'first_time',
  },
};
