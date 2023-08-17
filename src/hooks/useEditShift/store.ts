import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  year: number;
  month: number;
  currentShiftTeam: number | null;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  histories: EditHistory[];
  faults: Faults;
  checkFaultOptions: CheckFaultOptions | null;
  wardShiftTypeMap: Map<number, WardShiftType> | null;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

const useEditShiftStore = create<Store>()(
  devtools((set, get) => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    currentShiftTeam: null,
    focus: null,
    focusedDayInfo: null,
    foldedLevels: null,
    histories: [],
    faults: new Map(),
    checkFaultOptions: null,
    wardShiftTypeMap: null,
    setState: (key, value) =>
      set(
        produce(get(), (draft) => {
          draft[key] = value;
        })
      ),
  }))
);

export default useEditShiftStore;
