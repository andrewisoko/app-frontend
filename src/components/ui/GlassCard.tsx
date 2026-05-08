import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: ViewStyle;
  className?: string;
}

export default function GlassCard({ children, intensity = 30, style, className }: GlassCardProps) {
  return (
    <View
      className={`rounded-2xl overflow-hidden border border-white/10 ${className ?? ''}`}
      style={style}
    >
      <BlurView intensity={intensity} tint="dark" className="p-5">
        {children}
      </BlurView>
    </View>
  );
}
