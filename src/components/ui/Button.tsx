import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: 'py-2 px-4',
  md: 'py-3 px-6',
  lg: 'py-4 px-8',
};

const textSizeClasses: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        className={fullWidth ? 'w-full' : undefined}
      >
        <LinearGradient
          colors={isDisabled ? ['#334155', '#1E293B'] : [Colors.bluePrimary, Colors.purplePrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className={`rounded-xl items-center justify-center flex-row gap-2 ${sizeClasses[size]}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text
              className={`text-white font-inter-semibold ${textSizeClasses[size]}`}
              style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
            >
              {label}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        className={`rounded-xl border border-slate-600 items-center justify-center flex-row gap-2 ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-40' : ''}`}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.blueLight} />
        ) : (
          <Text
            className={`text-blue-400 ${textSizeClasses[size]}`}
            style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // danger
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={`rounded-xl border border-red-500 bg-red-500/10 items-center justify-center flex-row gap-2 ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-40' : ''}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.statusError} />
      ) : (
        <Text
          className={`text-red-400 ${textSizeClasses[size]}`}
          style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
