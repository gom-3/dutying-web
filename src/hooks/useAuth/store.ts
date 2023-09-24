/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  isAuth: boolean;
  accessToken: string | null;
  accountId: number | null;
  nurseId: number | null;
  wardId: number | null;
}

interface Store extends State {
  setState: (key: keyof State, value: any) => void;
  initState: () => void;
}

const initialState: State = {
  isAuth: false,
  accessToken: null,
  accountId: null,
  nurseId: null,
  wardId: null,
};

const useAuthStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setState: (key, value) =>
          set(
            produce(get(), (draft: any) => {
              draft[key] = value;
            })
          ),
        initState: () => set(initialState),
      }),
      {
        name: 'useAuthStore',
        partialize: ({ isAuth, accessToken, accountId, nurseId, wardId }: Store) => ({
          isAuth,
          accessToken,
          accountId,
          nurseId,
          wardId,
        }),
      }
    )
  )
);

export default useAuthStore;
