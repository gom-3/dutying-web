import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {type TValues} from '@/types/util';

interface State {
    selectedNurseId: number | null;
}

interface Store extends State {
    setState: (key: keyof State, value: TValues<State>) => void;
}

const initialState: State = {
    selectedNurseId: null,
};
const useEditNurseStore = create<Store>()(
    devtools((set) => ({
        ...initialState,
        setState: (state, value) => set((prev) => ({...prev, [state]: value})),
    })),
);

export default useEditNurseStore;
