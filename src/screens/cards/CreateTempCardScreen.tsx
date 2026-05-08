import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCards } from '../../context/CardContext';
import { useAccount } from '../../context/AccountContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';

export default function CreateTempCardScreen() {
  const navigation = useNavigation<any>();
  const { createTempCard, isLoading } = useCards();
  const { account } = useAccount();
  const [expiryTime, setExpiryTime] = useState<Date>(
    new Date(Date.now() + 24 * 60 * 60 * 1000), // default: +1 day
  );
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleCreate = async () => {
    if (!account) {
      setError('No account found. Please create an account first.');
      return;
    }
    setError(null);
    try {
      await createTempCard({
        accountId: account._id,
        expiry_time: expiryTime.toISOString(),
      });
      setDone(true);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to issue temporary card.');
    }
  };

  if (done) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-5xl">✓</Text>
          <Text className="text-white text-2xl text-center" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Temp card issued!
          </Text>
          <Text className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
            Your temporary virtual card expires on {expiryTime.toLocaleString()}.
          </Text>
          <Button label="View Cards" onPress={() => navigation.navigate('CardsList')} fullWidth />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable>
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_500Medium' }}>← Back</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl mb-2" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
        Issue Temporary Card
      </Text>
      <Text className="text-gray-400 text-sm mb-8" style={{ fontFamily: 'Inter_400Regular' }}>
        A temporary card expires at the time you set. Great for one-off transactions.
      </Text>

      {/* Expiry picker */}
      <Text className="text-gray-400 text-xs mb-2 ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
        Card Expiry Time
      </Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="bg-slate-800 border border-white/10 rounded-xl px-4 py-4 mb-8 flex-row justify-between items-center"
      >
        <Text className="text-white text-base" style={{ fontFamily: 'Inter_400Regular' }}>
          {expiryTime.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text className="text-blue-400 text-sm" style={{ fontFamily: 'Inter_500Medium' }}>Change</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={expiryTime}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={(_, date) => {
            setShowPicker(Platform.OS === 'ios');
            if (date) setExpiryTime(date);
          }}
        />
      )}

      {error && (
        <View className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <Text className="text-red-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>{error}</Text>
        </View>
      )}

      <Button label="Issue Temporary Card" onPress={handleCreate} loading={isLoading} fullWidth size="lg" />
    </ScreenWrapper>
  );
}
