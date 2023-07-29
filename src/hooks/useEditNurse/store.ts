/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  selectedNurseId: number | null;
  groupedNurses: Nurse[][] | null;
}

interface Store extends State {
  setState: (key: keyof State, value: any) => void;
}

const initialState: State = {
  selectedNurseId: null,
  groupedNurses: null,
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
