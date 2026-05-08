import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

interface GradientCardProps {
  children: React.ReactNode;
  colors?: string[];
  style?: ViewStyle;
  className?: string;
}

export default function GradientCard({
  children,
  colors = Colors.gradientBluePurple,
  style,
  className,
}: GradientCardProps) {
  return (
    <LinearGradient
      colors={colors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`rounded-2xl p-5 ${className ?? ''}`}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
