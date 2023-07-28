import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  year: number;
  month: number;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  histories: EditHistory[];
  faults: Faults;
  checkFaultOptions: CheckFaultOptions | null;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useEditShiftStore = create<Store>()(
  devtools((set, get) => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    focus: null,
    focusedDayInfo: null,
    foldedLevels: null,
    histories: [],
    faults: new Map(),
    checkFaultOptions: null,
    setState: (state, value) =>
      set(
        produce(get(), (draft) => {
          draft[state] = value;
        })
      ),
  }))
);
