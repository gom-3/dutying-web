import { produce } from 'immer';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  year: number;
  month: number;
  focus: Focus | null;
  foldedLevels: boolean[] | null;
  currentShiftTeamId: number | null;
  oldCurrentShiftTeamId: number | null;
  wardShiftTypeMap: Map<number, WardShiftType> | null;
  readonly: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initState: () => void;
}

const initialState: State = {
  year: new Date().getMonth() + 1 === 12 ? new Date().getFullYear() + 1 : new Date().getFullYear(),
  month: new Date().getMonth() + 1 === 12 ? 1 : new Date().getMonth() + 2,
  focus: null,
  currentShiftTeamId: null,
  oldCurrentShiftTeamId: null,
  foldedLevels: null,
  wardShiftTypeMap: null,
  readonly: true,
};

export const useRequestShiftStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setState: (state, value) =>
          set(
            produce(get(), (draft) => {
              draft[state] = value as never;
            })
          ),
        initState: () => set(initialState),
      }),
      {
        name: 'useRequestShiftStore',
        partialize: ({ year, month, currentShiftTeamId, oldCurrentShiftTeamId }: Store) => ({
          year,
          month,
          currentShiftTeamId,
          oldCurrentShiftTeamId,
        }),
      }
    )
  )
);
