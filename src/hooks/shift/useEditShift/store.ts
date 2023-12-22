import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  year: number;
  month: number;
  currentShiftTeamId: number | null;
  oldCurrentShiftTeamId: number | null;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  editHistory: EditHistory;
  faults: Faults;
  checkFaultOptions: CheckFaultOptions | null;
  wardShiftTypeMap: Map<number, WardShiftType> | null;
  readonly: boolean;
  showLayer: {
    fault: boolean;
    check: boolean;
    slash: boolean;
  };
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initState: () => void;
}

const initialState: State = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  focus: null,
  currentShiftTeamId: null,
  oldCurrentShiftTeamId: null,
  focusedDayInfo: null,
  foldedLevels: null,
  editHistory: new Map(),
  faults: new Map(),
  checkFaultOptions: null,
  wardShiftTypeMap: null,
  readonly: true,
  showLayer: {
    check: true,
    fault: true,
    slash: true,
  },
};

const useEditShiftStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setState: (key, value) =>
          set(
            produce(get(), (draft) => {
              draft[key] = value as never;
            })
          ),
        initState: () => set(initialState),
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
        partialize: ({
          year,
          month,
          editHistory,
          readonly,
          showLayer,
          currentShiftTeamId,
          oldCurrentShiftTeamId,
        }: Store) => ({
          year,
          month,
          editHistory,
          readonly,
          showLayer,
          currentShiftTeamId,
          oldCurrentShiftTeamId,
        }),
      }
    )
  )
);

export default useEditShiftStore;
