import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Colors } from '../../constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? '#F87171'
    : focused
    ? Colors.blueLight
    : '#334155';

  return (
    <View className="w-full mb-1">
      {label && (
        <Text
          className="text-gray-400 text-xs mb-1.5 ml-1"
          style={{ fontFamily: 'Inter_500Medium' }}
        >
          {label}
        </Text>
      )}

      <View
        className="flex-row items-center rounded-xl px-4 py-3 bg-slate-800"
        style={{ borderWidth: 1.5, borderColor }}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={Colors.gray400}
          className="flex-1 text-white text-base"
          style={[{ fontFamily: 'Inter_400Regular' }, style]}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} className="ml-3">
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          className="text-red-400 text-xs mt-1 ml-1"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
