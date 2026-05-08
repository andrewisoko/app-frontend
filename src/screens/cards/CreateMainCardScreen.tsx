import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCards } from '../../context/CardContext';
import { useAccount } from '../../context/AccountContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';

export default function CreateMainCardScreen() {
  const navigation = useNavigation<any>();
  const { createMainCard, isLoading } = useCards();
  const { account } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleCreate = async () => {
    if (!account) {
      setError('No account found. Please create an account first.');
      return;
    }
    setError(null);
    try {
      await createMainCard({ accountId: account._id });
      setDone(true);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to issue card.');
    }
  };

  if (done) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-5xl">✓</Text>
          <Text className="text-white text-2xl text-center" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Main card issued!
          </Text>
          <Text className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
            Your main virtual card is ready to use.
          </Text>
          <Button label="View Cards" onPress={() => navigation.navigate('CardsList')} fullWidth />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_500Medium' }}>← Back</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl mb-2" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
        Issue Main Card
      </Text>
      <Text className="text-gray-400 text-sm mb-8" style={{ fontFamily: 'Inter_400Regular' }}>
        Your main virtual card is linked to your account and can be used for payments and QR transactions.
      </Text>

      {account && (
        <View className="bg-slate-800 border border-white/10 rounded-2xl p-5 mb-8 gap-2">
          <Text className="text-gray-400 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>Linked Account</Text>
          <Text className="text-white text-base" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            {account.fullName}
          </Text>
          <Text className="text-gray-400 text-sm" style={{ fontFamily: 'SpaceMono_400Regular' }}>
            {account.accountNumber}
          </Text>
        </View>
      )}

      {error && (
        <View className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <Text className="text-red-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>{error}</Text>
        </View>
      )}

      <Button label="Issue Main Card" onPress={handleCreate} loading={isLoading} fullWidth size="lg" />
    </ScreenWrapper>
  );
}
