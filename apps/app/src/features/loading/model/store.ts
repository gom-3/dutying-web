import {createStore} from '@/shared/util/create-store';

const initialState = {
    loading: false,
};

export const useLoadingStore = createStore(initialState, {
    name: 'useLoadingStore',
    persist: false,
    actions: ({set}) => ({
        setLoading: (loading: boolean) => set('loading', loading),
    }),
});
