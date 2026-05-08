import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ContractsStackParamList } from '../../navigation/AppDrawer';
import { useContracts } from '../../context/ContractContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import { ContractStatus } from '../../types/contract.types';

type Nav = StackNavigationProp<ContractsStackParamList, 'ContractsList'>;
type FilterKey = 'all' | ContractStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'pending',  label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
  { key: 'failed',   label: 'Failed' },
];

export default function ContractsScreen() {
  const navigation = useNavigation<Nav>();
  const navAny = useNavigation<any>();
  const { contracts } = useContracts();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = filter === 'all'
    ? contracts
    : contracts.filter((c) => c.contract_status === filter);

  return (
    <ScreenWrapper padded={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4 border-b border-white/10">
        <TouchableOpacity onPress={() => navAny.dispatch(DrawerActions.openDrawer())}>
          <Text className="text-white text-xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>Contracts</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateContract')}
          className="bg-blue-600 w-8 h-8 rounded-full items-center justify-center"
        >
          <Text className="text-white text-lg">+</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(f) => f.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setFilter(item.key)}
            className={`px-4 py-1.5 rounded-full border ${
              filter === item.key
                ? 'bg-blue-600 border-blue-600'
                : 'border-white/20 bg-transparent'
            }`}
          >
            <Text
              className={`text-sm ${filter === item.key ? 'text-white' : 'text-gray-400'}`}
              style={{ fontFamily: filter === item.key ? 'Inter_600SemiBold' : 'Inter_400Regular' }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-gray-500 text-5xl">⚡</Text>
          <Text className="text-gray-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
            No contracts {filter !== 'all' ? `with status "${filter}"` : 'yet'}
          </Text>
          {filter === 'all' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateContract')}
              className="mt-2 bg-blue-600 px-5 py-2.5 rounded-xl"
            >
              <Text className="text-white text-sm" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                Create Contract
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ContractDetail', { contractId: item.id })}
              activeOpacity={0.85}
              className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-4 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-3">
                  <Text className="text-white text-sm" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
                    To: {item.receiver.join(', ')}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
                    {item.split_agreement === 'percentage'
                      ? `${item.sender_percentage}% sender`
                      : `£${item.sender_amount} sender`}
                    {' · '}{item.contract_type === 'one_time' ? 'One-time' : 'Recurring'}
                  </Text>
                </View>
                <Badge status={item.contract_status} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenWrapper>
  );
}
