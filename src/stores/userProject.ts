import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  myProject: MyProject | null;
  _hasHydrated: boolean; // 标记是否已经恢复
  setMyProject: (myProject: MyProject) => void;
  clearMyProject: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useProject = create<AuthState>()(
  persist(
    set => ({
      myProject: null,
      _hasHydrated: false,
      setMyProject: myProject => set({myProject}),
      clearMyProject: () => set({myProject: null}),

      setHasHydrated: state => set({_hasHydrated: state}),
    }),
    {
      name: 'myproject',
      storage: createJSONStorage(() => AsyncStorage),
      // 监听 persist 的 rehydration 完成
      // zustand/persist 会在 rehydrate 完成时触发一个回调，你可以用它来判断是否已经恢复。
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true); // rehydrate 完成
      },
    },
  ),
);
