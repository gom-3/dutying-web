import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  account: Account | null;
  setAccount: (account: Account | null) => void;
}

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        account: null,
        setAccount: (account: Account | null) => set(() => ({ account })),
      }),
      {
        name: 'store',
      }
    )
  )
);

export const useAccount = () =>
  useStore((state) => ({ account: state.account, setAccount: state.setAccount }));
