import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  year: number;
  month: number;
  focus: Focus | null;
  foldedLevels: boolean[] | null;
  currentShiftTeam: ShiftTeam | null;
  wardShiftTypeMap: Map<number, WardShiftType> | null;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initState: () => void;
}

const initialState: State = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 2,
  focus: null,
  currentShiftTeam: null,
  foldedLevels: null,
  wardShiftTypeMap: null,
};

export const useRequestShiftStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setState: (state, value) =>
          set(
            produce(get(), (draft) => {
              draft[state] = value;
            })
          ),
        initState: () => set(initialState),
      }),
      {
        name: 'useRequestShiftStore',
        partialize: ({ currentShiftTeam }: Store) => ({
          currentShiftTeam,
        }),
      }
    )
  )
);
