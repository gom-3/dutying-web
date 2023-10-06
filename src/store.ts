import { produce } from 'immer';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  isLogined: boolean;
  accountId: number | null;
  nurseId: number | null;
  wardId: number | null;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

const useGlobalStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        nurseId: 12,
        wardId: 2,
        setState: (key, value) =>
          set(
            produce(get(), (draft) => {
              draft[key] = value as never;
            })
          ),
      }),
      {
        name: 'store',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ setState, ...state }: Store) => state,
      }
    )
  )
);

export default useGlobalStore;
