import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  separateWeekendColor: boolean;
  shiftTypeColorStyle: 'background' | 'text';
  shiftTypeRadiusStyle: number;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initState: () => void;
}

const initialState: State = {
  separateWeekendColor: false,
  shiftTypeColorStyle: 'background',
  shiftTypeRadiusStyle: 0,
};

export const useUIConfigStore = create<Store>()(
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
        name: 'useUIConfigStore',
        partialize: ({
          separateWeekendColor,
          shiftTypeColorStyle,
          shiftTypeRadiusStyle,
        }: Store) => ({
          separateWeekendColor,
          shiftTypeColorStyle,
          shiftTypeRadiusStyle,
        }),
      }
    )
  )
);
