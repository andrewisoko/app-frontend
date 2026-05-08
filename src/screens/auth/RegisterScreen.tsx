import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await register(data);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Registration failed. Please try again.');
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
          <View className="flex-1 px-6 pt-16 pb-10">
            {/* Back */}
            <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
              <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_500Medium' }}>
                ← Back
              </Text>
            </TouchableOpacity>

            {/* Header */}
            <View className="mb-8">
              <Text
                className="text-white text-4xl mb-2"
                style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
              >
                Create account
              </Text>
              <Text
                className="text-gray-400 text-base"
                style={{ fontFamily: 'Inter_400Regular' }}
              >
                Join TransAct in seconds
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="First Name"
                        placeholder="John"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.name?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="surname"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Surname"
                        placeholder="Doe"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.surname?.message}
                      />
                    )}
                  />
                </View>
              </View>

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
                name="mobile_number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Mobile Number (optional)"
                    placeholder="+44 7700 900000"
                    keyboardType="phone-pad"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.mobile_number?.message}
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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Confirm Password"
                    placeholder="••••••••"
                    secureTextEntry
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.confirmPassword?.message}
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

            {/* Submit */}
            <View className="mt-8">
              <Button
                label="Create Account"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                fullWidth
                size="lg"
              />
            </View>

            {/* Login link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400 text-base" style={{ fontFamily: 'Inter_400Regular' }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
