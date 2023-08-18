/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  tempWard: Ward | null;
}

interface Store extends State {
  setState: (key: keyof State, value: any) => void;
}

const initialState: State = {
  tempWard: null,
};

const useEditWardStore = create<Store>()(
  devtools((set, get) => ({
    ...initialState,
    setState: (key, value) =>
      set(
        produce(get(), (draft: any) => {
          draft[key] = value;
        })
      ),
  }))
);

export default useEditWardStore;
