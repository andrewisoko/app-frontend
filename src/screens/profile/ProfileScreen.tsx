import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function ProfileScreen() {
  const navAny = useNavigation<any>();
  const { user, logout, deleteAccount } = useAuth();
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initials = user
    ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase()
    : 'TA';

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } finally {
      setIsDeleting(false);
      setDeleteVisible(false);
    }
  };

  return (
    <ScreenWrapper scrollable padded={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4 border-b border-white/10">
        <TouchableOpacity onPress={() => navAny.dispatch(DrawerActions.openDrawer())}>
          <Text className="text-white text-xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>Profile</Text>
        <View className="w-8" />
      </View>

      <View className="px-5">
        {/* Avatar */}
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-blue-600/30 border-2 border-blue-500 items-center justify-center mb-4">
            <Text className="text-white text-3xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
              {initials}
            </Text>
          </View>
          <Text className="text-white text-xl mb-1" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            {user?.name} {user?.surname}
          </Text>
          <Text className="text-gray-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
            @{user?.user_name}
          </Text>
          <View className="flex-row gap-2 mt-3">
            <Badge status={user?.role ?? 'user'} />
            <Badge status={user?.user_type === 'completed' ? 'active' : 'pending'} />
          </View>
        </View>

        {/* Info */}
        <View className="bg-slate-800 border border-white/10 rounded-2xl p-5 mb-5 gap-4">
          <InfoRow label="Email" value={user?.email ?? '—'} />
          <Sep />
          <InfoRow label="Mobile" value={user?.mobile_number ?? 'Not set'} />
          <Sep />
          <InfoRow label="User ID" value={user?.id ?? '—'} small />
        </View>

        {/* Actions */}
        <Button label="Logout" variant="ghost" fullWidth onPress={logout} />

        {/* Danger zone */}
        <View className="mt-6 mb-8 bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
          <Text className="text-red-400 text-sm mb-3" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            Danger Zone
          </Text>
          <Text className="text-gray-400 text-xs mb-4" style={{ fontFamily: 'Inter_400Regular' }}>
            Permanently delete your account and all associated data. This cannot be undone.
          </Text>
          <Button
            label="Delete Account"
            variant="danger"
            fullWidth
            onPress={() => setDeleteVisible(true)}
          />
        </View>
      </View>

      {/* Delete confirmation */}
      <Modal visible={deleteVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center px-8">
          <View className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 w-full gap-4">
            <Text className="text-white text-xl text-center" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
              Delete Account?
            </Text>
            <Text className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
              This will permanently delete your account, cards, and all data. This cannot be undone.
            </Text>
            <View className="flex-row gap-3 mt-2">
              <View className="flex-1">
                <Button label="Cancel" variant="ghost" fullWidth onPress={() => setDeleteVisible(false)} />
              </View>
              <View className="flex-1">
                <Button
                  label="Delete"
                  variant="danger"
                  fullWidth
                  loading={isDeleting}
                  onPress={handleDelete}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

function InfoRow({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <View>
      <Text className="text-gray-500 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>{label}</Text>
      <Text
        className={`text-white ${small ? 'text-xs' : 'text-sm'}`}
        style={{ fontFamily: 'Inter_500Medium' }}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function Sep() {
  return <View className="h-px bg-white/10" />;
}
