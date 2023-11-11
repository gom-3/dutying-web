import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  loading: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useLoadingStore = create<Store>()(
  devtools((set, get) => ({
    loading: false,
    setState: (state, value) =>
      set(
        produce(get(), (draft) => {
          draft[state] = value as never;
        })
      ),
  }))
);
