import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CardsStackParamList } from '../../navigation/AppDrawer';
import { useCards } from '../../context/CardContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import QRCode from 'react-native-qrcode-svg';

type RouteT = RouteProp<CardsStackParamList, 'CardDetail'>;

export default function CardDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteT>();
  const { mainCard, tempCards } = useCards();
  const [panRevealed, setPanRevealed] = useState(false);
  const [cvcRevealed, setCvcRevealed] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const allCards = mainCard ? [mainCard, ...tempCards] : tempCards;
  const card = allCards.find((c) => c.id === route.params.cardId);

  if (!card) {
    return (
      <ScreenWrapper>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_500Medium' }}>← Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-center mt-20" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
          Card not found
        </Text>
      </ScreenWrapper>
    );
  }

  const displayPan = panRevealed
    ? card.pan.replace(/(.{4})/g, '$1 ').trim()
    : '•••• •••• •••• ' + card.pan.slice(-4);

  return (
    <ScreenWrapper scrollable>
      {/* Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Text className="text-blue-400 text-base" style={{ fontFamily: 'Inter_500Medium' }}>← Back</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl mb-6" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
        Card Details
      </Text>

      {/* Card Preview */}
      <View
        className="bg-slate-800 border border-white/10 rounded-3xl p-6 mb-6"
        style={{
          shadowColor: card.card_type === 'main' ? '#2563EB' : '#7C3AED',
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <View className="flex-row justify-between items-start mb-6">
          <Text className="text-blue-300 text-sm" style={{ fontFamily: 'Inter_500Medium' }}>TransAct</Text>
          <Badge status={card.card_type} showDot={false} />
        </View>

        <Text
          className="text-white text-2xl tracking-widest mb-6"
          style={{ fontFamily: 'SpaceMono_400Regular' }}
        >
          {displayPan}
        </Text>

        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Inter_400Regular' }}>Card Holder</Text>
            <Text className="text-white text-base" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
              {card.full_name}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Inter_400Regular' }}>Expires</Text>
            <Text className="text-white text-base" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
              {card.expiry}
            </Text>
          </View>
        </View>
      </View>

      {/* Reveal controls */}
      <View className="bg-slate-800 border border-white/10 rounded-2xl p-5 mb-4 gap-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>PAN</Text>
            <Text className="text-white text-base" style={{ fontFamily: 'SpaceMono_400Regular' }}>
              {displayPan}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setPanRevealed((v) => !v)}
            className="bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-blue-400 text-xs" style={{ fontFamily: 'Inter_500Medium' }}>
              {panRevealed ? 'Hide' : 'Reveal'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-px bg-white/10" />

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>CVC</Text>
            <Text className="text-white text-base" style={{ fontFamily: 'SpaceMono_400Regular' }}>
              {cvcRevealed ? card.CVC : '•••'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setCvcRevealed((v) => !v)}
            className="bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-blue-400 text-xs" style={{ fontFamily: 'Inter_500Medium' }}>
              {cvcRevealed ? 'Hide' : 'Reveal'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-px bg-white/10" />

        <View>
          <Text className="text-gray-400 text-xs mb-0.5" style={{ fontFamily: 'Inter_400Regular' }}>Billing Address</Text>
          <Text className="text-white text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
            {card.billing_address}
          </Text>
        </View>
      </View>

      {/* QR Code button */}
      <Button
        label="Generate QR Code"
        onPress={() => setQrVisible(true)}
        variant="ghost"
        fullWidth
      />

      {/* QR Modal */}
      <Modal visible={qrVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-slate-900 rounded-t-3xl p-8 items-center border-t border-white/10">
            <View className="w-12 h-1 bg-white/20 rounded-full mb-6" />
            <Text className="text-white text-xl mb-2" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
              Card QR Code
            </Text>
            <Text
              className="text-gray-400 text-sm text-center mb-8"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              Point camera to share card details securely
            </Text>
            <View className="p-4 bg-white rounded-2xl mb-8">
              <QRCode value={card.qr_token || 'transact-card'} size={180} />
            </View>
            <Button label="Close" onPress={() => setQrVisible(false)} variant="ghost" fullWidth />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
