import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {setAccessToken} from '@/libs/api/client';
import {type Account} from '@/types/account';
import {type TValues} from '@/types/util';

interface IState {
    accountMe: Account | null;
    isAuth: boolean;
    accessToken: string | null;
    accountId: number | null;
    nurseId: number | null;
    wardId: number | null;
    demoStartDate: string | null;
    _loaded: boolean;
}

interface Store extends IState {
    setState: (key: keyof IState, value: TValues<IState>) => void;
    initState: () => void;
}

const initialState: IState = {
    accountMe: null,
    isAuth: false,
    accessToken: null,
    accountId: null,
    nurseId: null,
    wardId: null,
    demoStartDate: null,
    _loaded: false,
};
const useAuthStore = create<Store>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,
                setState: (state, value) => set((prev) => ({...prev, [state]: value})),
                initState: () => set({...initialState, _loaded: true}),
            }),
            {
                name: 'useAuthStore',
                partialize: ({isAuth, accessToken, accountId, nurseId, wardId, demoStartDate}: Store) => {
                    if (accessToken) setAccessToken(accessToken);

                    return {
                        isAuth,
                        accessToken,
                        accountId,
                        nurseId,
                        wardId,
                        demoStartDate,
                        _loaded: true,
                    };
                },
            },
        ),
    ),
);

export default useAuthStore;
