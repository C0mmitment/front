import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { TextArea } from './TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
    rows: {
      control: { type: 'number', min: 1, max: 10 },
    },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 20, maxWidth: 400 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    rows: 4,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    rows: 4,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Description',
    placeholder: 'Describe your project...',
    helperText: 'Maximum 500 characters',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    error: 'This field is required',
    rows: 4,
  },
};

export const Outlined: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    variant: 'outlined',
    rows: 4,
  },
};

export const Filled: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    variant: 'filled',
    rows: 4,
  },
};

export const LargeTextArea: Story = {
  args: {
    label: 'Extended Description',
    placeholder: 'Write a detailed description...',
    helperText: 'Please provide as much detail as possible',
    rows: 8,
  },
};

export const SmallTextArea: Story = {
  args: {
    label: 'Quick Note',
    placeholder: 'Add a quick note...',
    rows: 2,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled TextArea',
    placeholder: 'This is disabled...',
    editable: false,
    rows: 4,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Bio',
    defaultValue: 'This is a sample bio text that demonstrates how the TextArea component looks with existing content.',
    helperText: 'Tell us about yourself',
    rows: 5,
  },
};
