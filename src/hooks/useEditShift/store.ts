import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  year: number;
  month: number;
  currentShiftTeam: ShiftTeam | null;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  editHistory: EditHistory;
  faults: Faults;
  checkFaultOptions: CheckFaultOptions | null;
  wardShiftTypeMap: Map<number, WardShiftType> | null;
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
        currentShiftTeam: null,
        focusedDayInfo: null,
        foldedLevels: null,
        editHistory: new Map(),
        historyIndex: 0,
        faults: new Map(),
        checkFaultOptions: null,
        wardShiftTypeMap: null,
        setState: (key, value) =>
          set(
            produce(get(), (draft) => {
              draft[key] = value;
            })
          ),
      }),
      {
        name: 'useEditShiftStore',
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const { state } = JSON.parse(str);
            return {
              state: {
                ...state,
                editHistory: new Map(state.editHistory),
              },
            };
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setItem: (name, newValue: any) => {
            // functions cannot be JSON encoded
            const str = JSON.stringify({
              state: {
                ...newValue.state,
                editHistory: Array.from(newValue.state.editHistory.entries()),
              },
            });
            localStorage.setItem(name, str);
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
        partialize: ({ editHistory }: Store) => ({ editHistory }),
      }
    )
  )
);

export default useEditShiftStore;
