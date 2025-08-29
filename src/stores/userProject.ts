import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  myProject: MyProject | null | string;
  setMyProject: (myProject: MyProject) => void;
  clearMyProject: () => void;
}

export const useProject = create<AuthState>()(
  persist(
    set => ({
      myProject: null,
      setMyProject: (myProject: MyProject) => set({myProject}),
      clearMyProject: () => set({myProject: null}), // 清空 Zustand 状态
    }),
    {
      name: 'my-project-storage',
      storage: AsyncStorage as unknown as any,
    },
  ),
);
