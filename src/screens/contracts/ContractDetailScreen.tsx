import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ContractsStackParamList } from '../../navigation/AppDrawer';
import { useContracts } from '../../context/ContractContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import { formatDate, parseTimeAgreement, formatDuration } from '../../utils/formatters';
import { ContractStatus } from '../../types/contract.types';

type RouteT = RouteProp<ContractsStackParamList, 'ContractDetail'>;

export default function ContractDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteT>();
  const { contracts } = useContracts();
  const contract = contracts.find((c) => c.id === route.params.contractId);

  if (!contract) {
    return (
      <ScreenWrapper>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-blue-400" style={{ fontFamily: 'Inter_500Medium' }}>← Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-center mt-20" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
          Contract not found
        </Text>
      </ScreenWrapper>
    );
  }

  const timeRange = parseTimeAgreement(contract.time_agreement);

  return (
    <ScreenWrapper scrollable>
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_500Medium' }}>← Back</Text>
      </TouchableOpacity>

      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-2xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          Contract Detail
        </Text>
        <Badge status={contract.contract_status as ContractStatus} />
      </View>

      <View className="bg-slate-800 border border-white/10 rounded-2xl p-5 gap-4">
        <Row label="Sender" value={contract.sender} />
        <Sep />
        <Row label="Receivers" value={contract.receiver.join(', ')} />
        <Sep />
        <Row label="Type" value={contract.contract_type === 'one_time' ? 'One-Time' : 'Existing User'} />
        <Sep />
        <Row
          label="Split"
          value={
            contract.split_agreement === 'percentage'
              ? `Percentage — You: ${contract.sender_percentage}% | Others: ${contract.receiver_percentage.join('%, ')}%`
              : `Amount — You: £${contract.sender_amount} | Others: £${contract.receiver_amount.join(', £')}`
          }
        />
        {timeRange && (
          <>
            <Sep />
            <Row
              label="Period"
              value={`${formatDate(timeRange[0])} → ${formatDate(timeRange[1])} · ${formatDuration(timeRange[0], timeRange[1])}`}
            />
          </>
        )}
        {contract.repayment_agreement && (
          <>
            <Sep />
            <Row label="Repayment" value={contract.repayment_agreement} />
          </>
        )}
        {contract.event_agreement && (
          <>
            <Sep />
            <Row label="Event" value={contract.event_agreement} />
          </>
        )}
        {contract.location_agreement && (
          <>
            <Sep />
            <Row label="Location" value={contract.location_agreement} />
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-gray-500 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>{label}</Text>
      <Text className="text-white text-sm" style={{ fontFamily: 'Inter_500Medium' }}>{value}</Text>
    </View>
  );
}

function Sep() {
  return <View className="h-px bg-white/10" />;
}
