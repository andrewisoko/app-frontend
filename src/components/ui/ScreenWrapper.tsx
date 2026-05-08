import React from 'react';
import { SafeAreaView, ScrollView, View, StatusBar } from 'react-native';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  className?: string;
}

export default function ScreenWrapper({
  children,
  scrollable = false,
  padded = true,
  className,
}: ScreenWrapperProps) {
  const paddingClass = padded ? 'px-5' : '';

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      {scrollable ? (
        <ScrollView
          className={`flex-1 ${paddingClass} ${className ?? ''}`}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 ${paddingClass} ${className ?? ''}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
