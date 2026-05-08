import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InboxStackParamList } from '../../navigation/AppDrawer';
import { useInbox } from '../../context/InboxContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import { Contract, ContractStatus } from '../../types/contract.types';
import { formatDate } from '../../utils/formatters';

type Nav = StackNavigationProp<InboxStackParamList, 'InboxList'>;

type Tab = 'recent' | 'history';

function InboxItem({
  contract,
  onPress,
}: {
  contract: Partial<Contract>;
  onPress: () => void;
}) {
  const status = (contract.contract_status ?? 'pending') as ContractStatus;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-4 mb-3"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-white text-sm" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            From: {contract.sender ?? '—'}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            {contract.split_agreement === 'percentage'
              ? `Split ${contract.sender_percentage}% / others`
              : `Amount split`}
          </Text>
        </View>
        <Badge status={status} />
      </View>
      <Text className="text-gray-500 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
        {contract.contract_type === 'one_time' ? 'One-time' : 'Existing user'} contract
      </Text>
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const navigation = useNavigation<Nav>();
  const navAny = useNavigation<any>();
  const { recent, history, unreadCount, clearUnread } = useInbox();
  const [activeTab, setActiveTab] = useState<Tab>('recent');

  const data = activeTab === 'recent' ? recent : history;

  return (
    <ScreenWrapper padded={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4 border-b border-white/10">
        <TouchableOpacity onPress={() => navAny.dispatch(DrawerActions.openDrawer())}>
          <Text className="text-white text-xl">☰</Text>
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <Text className="text-white text-xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            Inbox
          </Text>
          {unreadCount > 0 && (
            <View className="bg-blue-600 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs" style={{ fontFamily: 'Inter_700Bold' }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View className="w-8" />
      </View>

      {/* Tabs */}
      <View className="flex-row mx-5 mt-4 mb-4 bg-slate-800 rounded-xl p-1">
        {(['recent', 'history'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              if (tab === 'recent') clearUnread();
            }}
            className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === tab ? 'bg-blue-600' : ''}`}
          >
            <Text
              className={`text-sm capitalize ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
              style={{ fontFamily: activeTab === tab ? 'SpaceGrotesk_600SemiBold' : 'Inter_400Regular' }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {data.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-gray-500 text-5xl">✉</Text>
          <Text className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
            {activeTab === 'recent' ? 'No recent contracts' : 'No history yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, i) => item.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <InboxItem
              contract={item}
              onPress={() =>
                item.id &&
                navigation.navigate('ContractReview', { contractId: item.id })
              }
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
}
