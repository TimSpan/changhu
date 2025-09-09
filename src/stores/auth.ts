import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  tokenInfo: TokenInfo | null;
  hasHydrated: boolean; // 标记是否已经恢复
  setTokenInfo: (tokenInfo: TokenInfo) => void;
  clearTokenInfo: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      tokenInfo: null,
      hasHydrated: false,
      setTokenInfo: tokenInfo => set({tokenInfo}),
      clearTokenInfo: () => set({tokenInfo: null}),
      setHasHydrated: state => set({hasHydrated: state}),
    }),
    {
      name: 'tokenInfo',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
