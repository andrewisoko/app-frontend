import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerContent from '../components/navigation/DrawerContent';
import HomeScreen from '../screens/home/HomeScreen';
import CardsScreen from '../screens/cards/CardsScreen';
import CardDetailScreen from '../screens/cards/CardDetailScreen';
import CreateMainCardScreen from '../screens/cards/CreateMainCardScreen';
import CreateTempCardScreen from '../screens/cards/CreateTempCardScreen';
import InboxScreen from '../screens/inbox/InboxScreen';
import ContractReviewScreen from '../screens/inbox/ContractReviewScreen';
import ContractsScreen from '../screens/contracts/ContractsScreen';
import ContractDetailScreen from '../screens/contracts/ContractDetailScreen';
import CreateContractScreen from '../screens/contracts/CreateContractScreen';
import AccountScreen from '../screens/account/AccountScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type DrawerParamList = {
  Home: undefined;
  Cards: undefined;
  Inbox: undefined;
  Contracts: undefined;
  Account: undefined;
  Profile: undefined;
};

export type CardsStackParamList = {
  CardsList: undefined;
  CardDetail: { cardId: string };
  CreateMainCard: undefined;
  CreateTempCard: undefined;
};

export type InboxStackParamList = {
  InboxList: undefined;
  ContractReview: { contractId: string };
};

export type ContractsStackParamList = {
  ContractsList: undefined;
  ContractDetail: { contractId: string };
  CreateContract: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();
const CardsStack = createStackNavigator<CardsStackParamList>();
const InboxStack = createStackNavigator<InboxStackParamList>();
const ContractsStack = createStackNavigator<ContractsStackParamList>();

function CardsNavigator() {
  return (
    <CardsStack.Navigator screenOptions={{ headerShown: false }}>
      <CardsStack.Screen name="CardsList" component={CardsScreen} />
      <CardsStack.Screen name="CardDetail" component={CardDetailScreen} />
      <CardsStack.Screen name="CreateMainCard" component={CreateMainCardScreen} />
      <CardsStack.Screen name="CreateTempCard" component={CreateTempCardScreen} />
    </CardsStack.Navigator>
  );
}

function InboxNavigator() {
  return (
    <InboxStack.Navigator screenOptions={{ headerShown: false }}>
      <InboxStack.Screen name="InboxList" component={InboxScreen} />
      <InboxStack.Screen name="ContractReview" component={ContractReviewScreen} />
    </InboxStack.Navigator>
  );
}

function ContractsNavigator() {
  return (
    <ContractsStack.Navigator screenOptions={{ headerShown: false }}>
      <ContractsStack.Screen name="ContractsList" component={ContractsScreen} />
      <ContractsStack.Screen name="ContractDetail" component={ContractDetailScreen} />
      <ContractsStack.Screen name="CreateContract" component={CreateContractScreen} />
    </ContractsStack.Navigator>
  );
}

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.6)',
        drawerStyle: { width: '75%', backgroundColor: 'transparent' },
        sceneStyle: { backgroundColor: '#0F172A' },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Cards" component={CardsNavigator} />
      <Drawer.Screen name="Inbox" component={InboxNavigator} />
      <Drawer.Screen name="Contracts" component={ContractsNavigator} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
