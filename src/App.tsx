import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppNavigation} from './navigation/AppNavigation';

import Toast from 'react-native-toast-message';
// import App_, { Navigation } from '@/navigation/App_';

import {Provider as PaperProvider} from 'react-native-paper';
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
}
