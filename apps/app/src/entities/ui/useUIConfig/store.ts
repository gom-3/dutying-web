import {createStore} from '@/shared/util/create-store';

export type TShiftTypeColorStyle = 'background' | 'text';

const initialState = {
    separateWeekendColor: false,
    shiftTypeColorStyle: 'background' as TShiftTypeColorStyle,
};

export const useUIConfigStore = createStore(initialState, {
    name: 'useUIConfigStore',
    actions: ({set}) => ({
        setSeparateWeekendColor: (value: boolean) => set('separateWeekendColor', value),
        setShiftTypeColorStyle: (value: TShiftTypeColorStyle) => set('shiftTypeColorStyle', value),
    }),
});
