import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, LoginFormData } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      await login(data);
      // RootNavigator auto-switches to AppDrawer on isAuthenticated
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Login failed. Check your credentials.');
    }
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E1B4B']}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-20 pb-10">
            {/* Header */}
            <View className="mb-10">
              <Text
                className="text-white text-4xl mb-2"
                style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
              >
                Welcome back
              </Text>
              <Text
                className="text-gray-400 text-base"
                style={{ fontFamily: 'Inter_400Regular' }}
              >
                Sign in to your TransAct account
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    secureTextEntry
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />
            </View>

            {/* API error */}
            {apiError && (
              <View className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <Text className="text-red-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
                  {apiError}
                </Text>
              </View>
            )}

            {/* Sign in button */}
            <View className="mt-8">
              <Button
                label="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                fullWidth
                size="lg"
              />
            </View>

            {/* Register link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400 text-base" style={{ fontFamily: 'Inter_400Regular' }}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
