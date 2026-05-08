import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useInbox } from '../../context/InboxContext';
import { Colors } from '../../constants/colors';

const menuItems = [
  { name: 'Home',      label: 'Home',          icon: '⌂' },
  { name: 'Cards',     label: 'Virtual Cards', icon: '▣' },
  { name: 'Inbox',     label: 'Inbox',         icon: '✉' },
  { name: 'Contracts', label: 'Contracts',     icon: '⚡' },
  { name: 'Account',   label: 'Account',       icon: '◈' },
  { name: 'Profile',   label: 'Profile',       icon: '◉' },
];

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useInbox();
  const currentRoute = props.state.routeNames[props.state.index];

  const initials = user
    ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase()
    : 'TA';

  return (
    <LinearGradient
      colors={['#0F172A', '#1E1B4B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header */}
        <View className="px-6 pt-12 pb-6 border-b border-white/10">
          <View className="w-14 h-14 rounded-full bg-blue-600/30 border-2 border-blue-500 items-center justify-center mb-3">
            <Text className="text-white text-xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
              {initials}
            </Text>
          </View>
          <Text className="text-white text-base" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
            {user ? `${user.name} ${user.surname}` : 'TransAct User'}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            {user?.user_name ?? '@username'}
          </Text>
        </View>

        {/* Menu Items */}
        <View className="px-4 pt-4 gap-1">
          {menuItems.map((item) => {
            const isActive = currentRoute === item.name;
            const showBadge = item.name === 'Inbox' && unreadCount > 0;

            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => props.navigation.navigate(item.name)}
                activeOpacity={0.8}
                className={`flex-row items-center px-4 py-3.5 rounded-xl gap-3 ${
                  isActive ? 'bg-blue-600/20 border border-blue-500/30' : ''
                }`}
              >
                <Text className={`text-lg ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                  {item.icon}
                </Text>
                <Text
                  className={`flex-1 text-base ${isActive ? 'text-blue-400' : 'text-gray-300'}`}
                  style={{ fontFamily: isActive ? 'SpaceGrotesk_600SemiBold' : 'Inter_400Regular' }}
                >
                  {item.label}
                </Text>
                {showBadge && (
                  <View className="bg-blue-600 rounded-full min-w-5 h-5 px-1.5 items-center justify-center">
                    <Text className="text-white text-xs" style={{ fontFamily: 'Inter_700Bold' }}>
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Logout */}
      <View className="px-4 pb-10 border-t border-white/10 pt-4">
        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.8}
          className="flex-row items-center px-4 py-3.5 rounded-xl gap-3 bg-red-500/10 border border-red-500/20"
        >
          <Text className="text-red-400 text-lg">⊗</Text>
          <Text className="text-red-400 text-base" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
