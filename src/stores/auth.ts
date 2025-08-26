// src/store/auth.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  tokenName: string | null;
  token: string | null;
  setToken: (token: string, tokenName: string) => void;
  logout: () => void;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  tokenName: null,
  setToken: async (token: string, tokenName: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('tokenName', tokenName);

    set({ token, tokenName });
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('tokenName');

    set({ token: null });
    set({ tokenName: null });
  },
  restoreToken: async () => {
    const token = await AsyncStorage.getItem('token');
    const tokenName = await AsyncStorage.getItem('tokenName');
    set({ token });
    set({ tokenName });
  },
}));
