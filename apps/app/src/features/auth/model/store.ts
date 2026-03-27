import {type PersistStorage, type StorageValue} from 'zustand/middleware';
import {type TAccount} from '@/entities/account';
import {setAccessToken} from '@/shared/api/client';
import {createStore} from '@/shared/util/create-store';

interface IState {
    accountMe: TAccount | null;
    accountMeStatus: 'idle' | 'loading' | 'success' | 'error';
    isAuth: boolean;
    isDemoExpired: boolean;
    accessToken: string | null;
    accountId: number | null;
    nurseId: number | null;
    wardId: number | null;
    demoStartDate: string | null;
    _loaded: boolean;
}

type TPersistedAuthState = Pick<IState, 'isAuth' | 'accessToken' | 'accountId' | 'nurseId' | 'wardId' | 'demoStartDate'>;

const initialState: IState = {
    accountMe: null,
    accountMeStatus: 'idle',
    isAuth: false,
    isDemoExpired: false,
    accessToken: null,
    accountId: null,
    nurseId: null,
    wardId: null,
    demoStartDate: null,
    _loaded: false,
};
const authStoreStorage: PersistStorage<TPersistedAuthState> = {
    getItem: (name) => {
        const value = localStorage.getItem(name);

        if (!value) return null;

        try {
            return JSON.parse(value) as StorageValue<TPersistedAuthState>;
        } catch {
            localStorage.removeItem(name);

            return null;
        }
    },
    setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
    removeItem: (name) => localStorage.removeItem(name),
};
const useAuthStore = createStore<
    IState,
    {
        startLogin: (accessToken: string, options?: {preserveDemoStartDate?: boolean}) => void;
        applyDemoSession: (payload: {
            accessToken: string;
            accountId: number | null;
            nurseId: number | null;
            wardId: number | null;
            demoStartDate: string;
        }) => void;
        beginAccountBootstrap: () => void;
        completeAccountBootstrap: (account: TAccount) => void;
        failAccountBootstrap: () => void;
        setDemoExpired: (expired: boolean) => void;
        completeHydration: () => void;
        resetSession: () => void;
    },
    false,
    TPersistedAuthState
>(initialState, {
    name: 'useAuthStore',
    persist: true,
    actions: ({patch}) => ({
        startLogin: (accessToken, options) =>
            patch((prev) => ({
                accountMe: null,
                accountMeStatus: 'loading',
                isAuth: true,
                isDemoExpired: false,
                accessToken,
                accountId: null,
                nurseId: null,
                wardId: null,
                demoStartDate: options?.preserveDemoStartDate ? prev.demoStartDate : null,
            })),
        applyDemoSession: ({accessToken, accountId, nurseId, wardId, demoStartDate}) =>
            patch({
                accountMe: null,
                accessToken,
                accountId,
                nurseId,
                wardId,
                isAuth: true,
                isDemoExpired: false,
                accountMeStatus: 'success',
                demoStartDate,
            }),
        beginAccountBootstrap: () =>
            patch({
                accountMeStatus: 'loading',
            }),
        completeAccountBootstrap: (account) =>
            patch({
                accountMe: account,
                wardId: account.wardId,
                accountId: account.accountId,
                nurseId: account.nurseId,
                isAuth: true,
                accountMeStatus: 'success',
            }),
        failAccountBootstrap: () =>
            patch({
                accountMeStatus: 'error',
            }),
        setDemoExpired: (expired) =>
            patch({
                isDemoExpired: expired,
            }),
        completeHydration: () =>
            patch({
                _loaded: true,
            }),
        resetSession: () =>
            patch({
                ...initialState,
                _loaded: true,
            }),
    }),
    persistOptions: {
        storage: authStoreStorage,
        partialize: ({isAuth, accessToken, accountId, nurseId, wardId, demoStartDate}): TPersistedAuthState => {
            if (accessToken) setAccessToken(accessToken);

            return {
                isAuth,
                accessToken,
                accountId,
                nurseId,
                wardId,
                demoStartDate,
            };
        },
        onRehydrateStorage: (state) => (rehydratedState) => {
            (rehydratedState ?? state).completeHydration();
        },
    },
});

export default useAuthStore;
