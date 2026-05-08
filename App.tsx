import './global.css';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  SpaceMono_400Regular,
} from '@expo-google-fonts/space-mono';

import { AuthProvider } from './src/context/AuthContext';
import { AccountProvider } from './src/context/AccountContext';
import { CardProvider } from './src/context/CardContext';
import { ContractProvider } from './src/context/ContractContext';
import { InboxProvider } from './src/context/InboxContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    SpaceMono_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AccountProvider>
          <CardProvider>
            <ContractProvider>
              <InboxProvider>
                <RootNavigator />
              </InboxProvider>
            </ContractProvider>
          </CardProvider>
        </AccountProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
