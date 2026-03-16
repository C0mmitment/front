import { View } from 'react-native';

import PhotoTips from './tips';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PhotoTips> = {
  title: 'Components/Tips',
  component: PhotoTips,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#ffffff', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PhotoTips>;

export const Photo: Story = {
  name: 'photo（撮影・構図）',
  args: {
    title: '三分割法',
    content: '画面を縦横3分割し、交点に被写体を配置するとバランスの良い写真になるよ。',
    category: 'photo',
  },
};

export const App: Story = {
  name: 'app（アプリの使い方）',
  args: {
    title: 'ここはなに？',
    content: 'やくに立つかもしれない情報が書かれているよ！',
    category: 'app',
  },
};

export const Dev: Story = {
  name: 'dev（開発者ネタ・裏話）',
  args: {
    title: '制作者？２',
    content: '「九割九分九厘何もしていない」',
    category: 'dev',
  },
};

export const Other: Story = {
  name: 'other（その他）',
  args: {
    title: '最後の一押し！',
    content: '最後は自分を信じるのだ！！',
    category: 'other',
  },
};
