import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {type TValues} from '@/types/util';

interface State {
    separateWeekendColor: boolean;
    shiftTypeColorStyle: 'background' | 'text';
}

interface Store extends State {
    setState: (key: keyof State, value: TValues<State>) => void;
    initState: () => void;
}

const initialState: State = {
    separateWeekendColor: false,
    shiftTypeColorStyle: 'background',
};

export const useUIConfigStore = create<Store>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,
                setState: (state, value) => set((prev) => ({...prev, [state]: value})),
                initState: () => set(initialState),
            }),
            {
                name: 'useUIConfigStore',
                partialize: ({separateWeekendColor, shiftTypeColorStyle}: Store) => ({
                    separateWeekendColor,
                    shiftTypeColorStyle,
                }),
            },
        ),
    ),
);
