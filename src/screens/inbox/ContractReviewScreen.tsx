import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { InboxStackParamList } from '../../navigation/AppDrawer';
import { useInbox } from '../../context/InboxContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate, parseTimeAgreement, formatDuration } from '../../utils/formatters';
import { ContractStatus } from '../../types/contract.types';

type RouteT = RouteProp<InboxStackParamList, 'ContractReview'>;

export default function ContractReviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteT>();
  const { recent, respondToInboxContract } = useInbox();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'accept' | 'decline' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contract = recent.find((c) => c.id === route.params.contractId);

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

  const status = (contract.contract_status ?? 'pending') as ContractStatus;
  const isPending = status === 'pending';
  const timeRange = contract.time_agreement ? parseTimeAgreement(contract.time_agreement) : null;

  const handleRespond = async (accepted: boolean) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await respondToInboxContract({
        contractId: contract.id!,
        receiverIds: '',
        accepted,
      });
      setConfirmVisible(false);
      navigation.goBack();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Action failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_500Medium' }}>← Back</Text>
      </TouchableOpacity>

      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-2xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          Contract
        </Text>
        <Badge status={status} />
      </View>

      {/* Details */}
      <View className="bg-slate-800 border border-white/10 rounded-2xl p-5 mb-4 gap-4">
        <DetailRow label="From" value={contract.sender ?? '—'} />
        <Divider />
        <DetailRow label="To (You + others)" value={contract.receiver?.join(', ') ?? '—'} />
        <Divider />
        <DetailRow label="Contract Type" value={contract.contract_type === 'one_time' ? 'One-Time' : 'Existing User'} />
        <Divider />
        <DetailRow
          label="Split Agreement"
          value={
            contract.split_agreement === 'percentage'
              ? `By Percentage — Sender: ${contract.sender_percentage}%`
              : `By Amount — Sender: £${contract.sender_amount}`
          }
        />
        {timeRange && (
          <>
            <Divider />
            <DetailRow
              label="Contract Period"
              value={`${formatDate(timeRange[0])} → ${formatDate(timeRange[1])} (${formatDuration(timeRange[0], timeRange[1])})`}
            />
          </>
        )}
        {contract.repayment_agreement && (
          <>
            <Divider />
            <DetailRow label="Repayment" value={contract.repayment_agreement} />
          </>
        )}
        {contract.event_agreement && (
          <>
            <Divider />
            <DetailRow label="Event Trigger" value={contract.event_agreement} />
          </>
        )}
        {contract.location_agreement && (
          <>
            <Divider />
            <DetailRow label="Location" value={contract.location_agreement} />
          </>
        )}
      </View>

      {error && (
        <View className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <Text className="text-red-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>{error}</Text>
        </View>
      )}

      {/* Actions */}
      {isPending && (
        <View className="flex-row gap-3 mt-2">
          <View className="flex-1">
            <Button
              label="Decline"
              variant="danger"
              fullWidth
              onPress={() => { setConfirmAction('decline'); setConfirmVisible(true); }}
            />
          </View>
          <View className="flex-1">
            <Button
              label="Accept"
              fullWidth
              onPress={() => { setConfirmAction('accept'); setConfirmVisible(true); }}
            />
          </View>
        </View>
      )}

      {/* Confirm modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center px-8">
          <View className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full gap-4">
            <Text className="text-white text-xl text-center" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
              {confirmAction === 'accept' ? 'Accept Contract?' : 'Decline Contract?'}
            </Text>
            <Text className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
              {confirmAction === 'accept'
                ? 'You are agreeing to the terms of this split agreement.'
                : 'This will reject the contract. This action cannot be undone.'}
            </Text>
            <View className="flex-row gap-3 mt-2">
              <View className="flex-1">
                <Button label="Cancel" variant="ghost" fullWidth onPress={() => setConfirmVisible(false)} />
              </View>
              <View className="flex-1">
                <Button
                  label={confirmAction === 'accept' ? 'Accept' : 'Decline'}
                  variant={confirmAction === 'accept' ? 'primary' : 'danger'}
                  fullWidth
                  loading={isSubmitting}
                  onPress={() => handleRespond(confirmAction === 'accept')}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-gray-500 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>{label}</Text>
      <Text className="text-white text-sm" style={{ fontFamily: 'Inter_500Medium' }}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-white/10" />;
}
