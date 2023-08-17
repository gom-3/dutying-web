import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  account: User | null;
  setState: (account: User) => void;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useStore = create<Store>()(
  devtools(
    (set) => ({
      account: {
        nurseId: 1,
        wardId: 1,
      },
      setState: (account: User) => set(() => ({ account })),
    }),
    {
      name: 'store',
    }
  )
);

export const useAccount = () =>
  useStore((state) => ({ account: state.account, setState: state.setState }));
