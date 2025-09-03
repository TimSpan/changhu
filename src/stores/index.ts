import {create} from 'zustand';

type State = {user: any; setUser: (user: any) => void};

export const useUserStore = create<State>(set => ({
  user: null,
  setUser: user => set({user}),
}));
