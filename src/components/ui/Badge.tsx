import React from 'react';
import { View, Text } from 'react-native';

type BadgeStatus =
  | 'active'
  | 'Inactive'
  | 'Suspended'
  | 'Closed'
  | 'Pending'
  | 'accepted'
  | 'declined'
  | 'failed'
  | 'pending'
  | 'main'
  | 'temporary'
  | 'admin'
  | 'user';

const statusConfig: Record<BadgeStatus, { bg: string; text: string; dot: string; label: string }> = {
  active:    { bg: 'bg-green-500/15',  text: 'text-green-400',  dot: 'bg-green-400',  label: 'Active' },
  Inactive:  { bg: 'bg-gray-500/15',   text: 'text-gray-400',   dot: 'bg-gray-400',   label: 'Inactive' },
  Suspended: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Suspended' },
  Closed:    { bg: 'bg-red-500/15',    text: 'text-red-400',    dot: 'bg-red-400',    label: 'Closed' },
  Pending:   { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Pending' },
  accepted:  { bg: 'bg-green-500/15',  text: 'text-green-400',  dot: 'bg-green-400',  label: 'Accepted' },
  declined:  { bg: 'bg-red-500/15',    text: 'text-red-400',    dot: 'bg-red-400',    label: 'Declined' },
  failed:    { bg: 'bg-red-500/15',    text: 'text-red-400',    dot: 'bg-red-400',    label: 'Failed' },
  pending:   { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Pending' },
  main:      { bg: 'bg-blue-500/15',   text: 'text-blue-400',   dot: 'bg-blue-400',   label: 'MAIN' },
  temporary: { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400', label: 'TEMP' },
  admin:     { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400', label: 'Admin' },
  user:      { bg: 'bg-blue-500/15',   text: 'text-blue-400',   dot: 'bg-blue-400',   label: 'User' },
};

interface BadgeProps {
  status: BadgeStatus;
  showDot?: boolean;
}

export default function Badge({ status, showDot = true }: BadgeProps) {
  const config = statusConfig[status] ?? statusConfig['Inactive'];

  return (
    <View className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
      {showDot && <View className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      <Text
        className={`text-xs ${config.text}`}
        style={{ fontFamily: 'Inter_500Medium' }}
      >
        {config.label}
      </Text>
    </View>
  );
}
