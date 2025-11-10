import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

export interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  rows = 4,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return 'border-2 border-gray-300 bg-transparent';
      case 'filled':
        return 'border-0 bg-gray-100';
      default:
        return 'border border-gray-300 bg-white';
    }
  };

  const borderColorClass = error ? 'border-red-500' : 'focus:border-blue-500';

  return (
    <View className="w-full">
      {label && (
        <Text className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </Text>
      )}

      <TextInput
        multiline
        numberOfLines={rows}
        className={`
          rounded-lg px-4 py-3 text-base text-gray-900
          ${getVariantStyles()}
          ${borderColorClass}
          ${error ? 'border-blue-500' : ''}
          ${className}
        `}
        placeholderTextColor="#9CA3AF"
        {...props}
      />

      {(error || helperText) && (
        <Text className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default TextArea;
