/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  selectedNurseId: number | null;
}

interface Store extends State {
  setState: (key: keyof State, value: any) => void;
}

const initialState: State = {
  selectedNurseId: null,
};

const useEditNurseStore = create<Store>()(
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

export default useEditNurseStore;
