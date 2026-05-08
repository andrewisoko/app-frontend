import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useAccount } from '../../context/AccountContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import GradientCard from '../../components/ui/GradientCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatBalance } from '../../utils/formatters';
import { Colors } from '../../constants/colors';
import { AccountStatus } from '../../types/account.types';

export default function AccountScreen() {
  const navAny = useNavigation<any>();
  const { account, createAccount, isLoading } = useAccount();

  if (!account) {
    return (
      <ScreenWrapper>
        <View className="flex-row items-center mb-8 gap-4">
          <TouchableOpacity onPress={() => navAny.dispatch(DrawerActions.openDrawer())}>
            <Text className="text-white text-xl">☰</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>Account</Text>
        </View>
        <View className="flex-1 items-center justify-center gap-5">
          <Text className="text-gray-500 text-5xl">◈</Text>
          <Text className="text-white text-xl text-center" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            No account yet
          </Text>
          <Text className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
            Create your TransAct account to manage balances and issue virtual cards.
          </Text>
          <Button label="Create Account" onPress={createAccount} loading={isLoading} fullWidth />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable padded={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4 border-b border-white/10">
        <TouchableOpacity onPress={() => navAny.dispatch(DrawerActions.openDrawer())}>
          <Text className="text-white text-xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>Account</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <GradientCard colors={Colors.gradientBluePurple} className="mt-5 mb-5">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-white/60 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>Account Name</Text>
              <Text className="text-white text-base mt-0.5" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
                {account.fullName}
              </Text>
            </View>
            <Badge status={account.status as AccountStatus} />
          </View>

          <Text className="text-white text-3xl mt-3 mb-1" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            {formatBalance(account.available_balance, account.currency)}
          </Text>
          <Text className="text-white/50 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
            Available Balance
          </Text>
        </GradientCard>

        {/* Balance breakdown */}
        <View className="flex-row gap-3 mb-5">
          <BalanceBox label="Ledger" value={formatBalance(account.ledger_balance, account.currency)} />
          <BalanceBox label="On Hold" value={formatBalance(account.hold, account.currency)} />
        </View>

        {/* Account details */}
        <View className="bg-slate-800 border border-white/10 rounded-2xl p-5 mb-5 gap-4">
          <DetailRow label="Account Number" value={String(account.accountNumber)} mono />
          <Sep />
          <DetailRow label="Currency" value={account.currency} />
          <Sep />
          <DetailRow label="PAN" value={`•••• •••• •••• ${account.pan.slice(-4)}`} mono />
          <Sep />
          <DetailRow label="Expiry" value={account.expiry} />
          <Sep />
          <DetailRow label="Virtual Cards" value={`${account.tempVirtualCard.length + (account.mainVirtualCard ? 1 : 0)} issued`} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function BalanceBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 bg-slate-800 border border-white/10 rounded-2xl p-4">
      <Text className="text-gray-400 text-xs mb-1" style={{ fontFamily: 'Inter_400Regular' }}>{label}</Text>
      <Text className="text-white text-base" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>{value}</Text>
    </View>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View>
      <Text className="text-gray-500 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>{label}</Text>
      <Text
        className="text-white text-sm"
        style={{ fontFamily: mono ? 'SpaceMono_400Regular' : 'Inter_500Medium' }}
      >
        {value}
      </Text>
    </View>
  );
}

function Sep() {
  return <View className="h-px bg-white/10" />;
}
