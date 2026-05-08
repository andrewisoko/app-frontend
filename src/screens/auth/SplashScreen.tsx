import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';

type Nav = StackNavigationProp<AuthStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const { isAuthenticated, isLoading } = useAuth();

  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          // RootNavigator handles this — no action needed
        } else {
          navigation.replace('Login');
        }
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <LinearGradient
      colors={['#0F172A', '#1E1B4B', '#4C1D95']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center' }}>
        {/* Logo mark */}
        <View className="w-20 h-20 rounded-2xl bg-blue-600/30 border-2 border-blue-400/60 items-center justify-center mb-6">
          <Text
            className="text-blue-300 text-4xl font-bold"
            style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
          >
            T
          </Text>
        </View>

        <Text
          className="text-white text-4xl tracking-tight"
          style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
        >
          TransAct
        </Text>
      </Animated.View>

      <Animated.Text
        style={{ opacity: subtitleOpacity, fontFamily: 'Inter_400Regular' }}
        className="text-purple-300 text-base mt-3 tracking-widest"
      >
        YOUR MONEY. YOUR RULES.
      </Animated.Text>
    </LinearGradient>
  );
}
