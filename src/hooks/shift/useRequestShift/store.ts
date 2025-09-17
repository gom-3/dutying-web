import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type TValues } from '@/types/util';
import { type WardShiftType } from '@/types/ward';
import { type Focus } from '../useEditShift/types';

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
  setState: (key: keyof State, value: TValues<State>) => void;
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
      (set) => ({
        ...initialState,
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
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
      },
    ),
  ),
);
