import type {TPageStateLoadingColor} from '@/shared/ui/PageState';
import {createStore} from '@/shared/util/create-store';

const initialState = {
    loading: false,
    loadingColor: 'purple' as TPageStateLoadingColor,
};

export const useLoadingStore = createStore(initialState, {
    name: 'useLoadingStore',
    persist: false,
    actions: ({patch}) => ({
        setLoading: (loading: boolean, options?: {color?: TPageStateLoadingColor}) =>
            patch({
                loading,
                loadingColor: loading ? (options?.color ?? 'purple') : 'purple',
            }),
    }),
});
