import { View } from 'react-native';

import PhotoTips from './tips';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PhotoTips> = {
  title: 'Tips',
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

export const Default: Story = {
  args: {},
};
