import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppNavigation} from './navigation/AppNavigation';
import Toast from 'react-native-toast-message';
import {Provider as PaperProvider} from 'react-native-paper';
import {ConfirmDialogProvider} from './components/ConfirmDialog/ConfirmDialogProvider';
export default function App() {
  return (
    <PaperProvider>
      <ConfirmDialogProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
        <Toast />
      </ConfirmDialogProvider>
    </PaperProvider>
  );
}
