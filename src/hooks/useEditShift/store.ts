import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  year: number;
  month: number;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  editHistory: EditHistory;
  faults: Faults;
  checkFaultOptions: CheckFaultOptions | null;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

const useEditShiftStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        focus: null,
        focusedDayInfo: null,
        foldedLevels: null,
        editHistory: [],
        historyIndex: 0,
        faults: new Map(),
        checkFaultOptions: null,
        setState: (key, value) =>
          set(
            produce(get(), (draft) => {
              draft[key] = value;
            })
          ),
      }),
      {
        name: 'useEditShiftStore',
        partialize: ({ editHistory }: Store) => ({ editHistory }),
      }
    )
  )
);

export default useEditShiftStore;
