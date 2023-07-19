import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type User = {
  nurseId: number;
  wardId: number;
};

interface State {
  account: User;
  setAccount: (account: User) => void;
}

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        account: {
          nurseId: 1,
          wardId: 1,
        },
        setAccount: (account: User) => set(() => ({ account })),
      }),
      {
        name: 'store',
      }
    )
  )
);

export const useAccount = () =>
  useStore((state) => ({ account: state.account, setAccount: state.setAccount }));
