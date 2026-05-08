import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useAccount } from '../../context/AccountContext';
import { useInbox } from '../../context/InboxContext';
import { useContracts } from '../../context/ContractContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import GradientCard from '../../components/ui/GradientCard';
import Badge from '../../components/ui/Badge';
import { formatBalance, formatDate } from '../../utils/formatters';
import { Colors } from '../../constants/colors';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { account } = useAccount();
  const { unreadCount } = useInbox();
  const { contracts } = useContracts();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentContracts = contracts.slice(0, 3);

  return (
    <ScreenWrapper scrollable padded={false}>
      {/* Header */}
      <LinearGradient
        colors={['#1E1B4B', '#0F172A']}
        className="px-5 pt-4 pb-6"
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Text className="text-white text-xl">☰</Text>
          </TouchableOpacity>

          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Inbox')}
              className="flex-row items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-full"
            >
              <Text className="text-blue-400 text-xs" style={{ fontFamily: 'Inter_500Medium' }}>
                {unreadCount} new {unreadCount === 1 ? 'contract' : 'contracts'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text
          className="text-gray-400 text-base mb-1"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {greeting()},
        </Text>
        <Text
          className="text-white text-2xl"
          style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
        >
          {user?.name ?? 'Welcome'} 👋
        </Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <GradientCard
          colors={Colors.gradientBluePurple}
          className="mt-4 mb-6"
        >
          <Text className="text-white/60 text-xs mb-1" style={{ fontFamily: 'Inter_400Regular' }}>
            Available Balance
          </Text>
          <Text
            className="text-white text-3xl mb-4"
            style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
          >
            {account
              ? formatBalance(account.available_balance, account.currency)
              : '—'}
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white/50 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>Ledger</Text>
              <Text className="text-white text-base mt-0.5" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                {account ? formatBalance(account.ledger_balance, account.currency) : '—'}
              </Text>
            </View>
            <View>
              <Text className="text-white/50 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>On Hold</Text>
              <Text className="text-white text-base mt-0.5" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                {account ? formatBalance(account.hold, account.currency) : '—'}
              </Text>
            </View>
            <View>
              <Text className="text-white/50 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>Currency</Text>
              <Text className="text-white text-base mt-0.5" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                {account?.currency ?? '—'}
              </Text>
            </View>
          </View>
        </GradientCard>

        {/* Quick Actions */}
        <Text
          className="text-white text-lg mb-3"
          style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
        >
          Quick Actions
        </Text>
        <View className="flex-row gap-3 mb-6">
          {[
            { label: 'Cards',     icon: '▣', route: 'Cards' },
            { label: 'Inbox',     icon: '✉', route: 'Inbox' },
            { label: 'Contract',  icon: '⚡', route: 'Contracts' },
            { label: 'Account',   icon: '◈', route: 'Account' },
          ].map((action) => (
            <TouchableOpacity
              key={action.route}
              onPress={() => navigation.navigate(action.route)}
              activeOpacity={0.8}
              className="flex-1 bg-slate-800 border border-white/10 rounded-2xl py-4 items-center gap-1"
            >
              <Text className="text-blue-400 text-2xl">{action.icon}</Text>
              <Text
                className="text-gray-300 text-xs text-center"
                style={{ fontFamily: 'Inter_500Medium' }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Contracts */}
        <View className="flex-row items-center justify-between mb-3">
          <Text
            className="text-white text-lg"
            style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
          >
            Recent Contracts
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Contracts')}>
            <Text className="text-blue-400 text-sm" style={{ fontFamily: 'Inter_500Medium' }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {recentContracts.length === 0 ? (
          <View className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 items-center mb-6">
            <Text className="text-gray-500 text-4xl mb-2">⚡</Text>
            <Text className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
              No contracts yet.{'\n'}Create your first split agreement.
            </Text>
          </View>
        ) : (
          <View className="gap-3 mb-6">
            {recentContracts.map((contract) => (
              <TouchableOpacity
                key={contract.id}
                onPress={() => navigation.navigate('Contracts', { screen: 'ContractDetail', params: { contractId: contract.id } })}
                activeOpacity={0.8}
                className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-3.5 flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-white text-sm" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                    {contract.receiver?.join(', ')}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
                    {contract.split_agreement === 'percentage'
                      ? `${contract.sender_percentage}% / ${contract.receiver_percentage?.join('%, ')}%`
                      : `£${contract.sender_amount} / £${contract.receiver_amount?.join(', £')}`}
                  </Text>
                </View>
                <Badge status={contract.contract_status} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
