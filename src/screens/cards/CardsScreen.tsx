import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CardsStackParamList } from '../../navigation/AppDrawer';
import { useCards } from '../../context/CardContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import { maskPAN } from '../../utils/formatters';
import { VirtualCard } from '../../types/card.types';

type Nav = StackNavigationProp<CardsStackParamList, 'CardsList'>;

function CardTile({ card, onPress }: { card: VirtualCard; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-slate-800 border border-white/10 rounded-2xl p-5 mb-3"
      style={{
        shadowColor: card.card_type === 'main' ? '#2563EB' : '#7C3AED',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="bg-blue-600/20 rounded-lg px-3 py-1">
          <Text className="text-blue-300 text-xs" style={{ fontFamily: 'Inter_500Medium' }}>
            TransAct
          </Text>
        </View>
        <Badge status={card.card_type} showDot={false} />
      </View>

      <Text
        className="text-white text-xl tracking-widest mb-4"
        style={{ fontFamily: 'SpaceMono_400Regular' }}
      >
        {maskPAN(card.pan)}
      </Text>

      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-gray-500 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            Card Holder
          </Text>
          <Text className="text-white text-sm" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            {card.full_name}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-500 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            Expires
          </Text>
          <Text className="text-white text-sm" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            {card.expiry}
          </Text>
        </View>
      </View>

      {card.card_type === 'temporary' && card.expiry_time && (
        <View className="mt-3 pt-3 border-t border-white/10">
          <Text className="text-yellow-400 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
            ⏱ Expires: {new Date(card.expiry_time).toLocaleString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CardsScreen() {
  const navigation = useNavigation<Nav>();
  const navAny = useNavigation<any>();
  const { mainCard, tempCards } = useCards();

  const allCards = [
    ...(mainCard ? [mainCard] : []),
    ...tempCards,
  ];

  return (
    <ScreenWrapper padded={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4 border-b border-white/10">
        <TouchableOpacity onPress={() => navAny.dispatch(DrawerActions.openDrawer())}>
          <Text className="text-white text-xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          Virtual Cards
        </Text>
        <View className="w-8" />
      </View>

      {allCards.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-500 text-6xl mb-4">▣</Text>
          <Text
            className="text-white text-xl mb-2 text-center"
            style={{ fontFamily: 'SpaceGrotesk_700Bold' }}
          >
            No cards yet
          </Text>
          <Text
            className="text-gray-400 text-sm text-center mb-8"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            Issue your first virtual card to get started with TransAct.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateMainCard')}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white text-base" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
              Issue Main Card
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={allCards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'Inter_400Regular' }}>
              {allCards.length} card{allCards.length !== 1 ? 's' : ''} total
            </Text>
          }
          renderItem={({ item }) => (
            <CardTile
              card={item}
              onPress={() => navigation.navigate('CardDetail', { cardId: item.id })}
            />
          )}
        />
      )}

      {/* FAB */}
      {allCards.length > 0 && (
        <View className="absolute bottom-8 right-5 gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateTempCard')}
            activeOpacity={0.85}
            className="w-12 h-12 rounded-full bg-purple-600 items-center justify-center shadow-lg"
            style={{ shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 8 }}
          >
            <Text className="text-white text-xl">+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateMainCard')}
            activeOpacity={0.85}
            className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center shadow-lg"
            style={{ shadowColor: '#2563EB', shadowOpacity: 0.5, shadowRadius: 8 }}
          >
            <Text className="text-white text-xl">▣</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenWrapper>
  );
}
