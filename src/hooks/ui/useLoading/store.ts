import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type TValues } from '@/types/util';

interface State {
  loading: boolean;
}

interface Store extends State {
  setState: (key: keyof State, value: TValues<State>) => void;
}

export const useLoadingStore = create<Store>()(
  devtools((set) => ({
    loading: false,
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
  })),
);
