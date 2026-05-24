import {create} from 'zustand';
import {devtools, persist, type PersistStorage, type StorageValue} from 'zustand/middleware';
import {type TAccount} from '@/entities/account';
import {setAccessToken} from '@/shared/api/client';
import {createStoreWriteHelpers} from '@/shared/util/create-store';

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

interface IStore extends IState {
    beginLogin: (accessToken: string, options?: {preserveDemoStartDate?: boolean}) => void;
    applyDemoSession: (payload: {
        accessToken: string;
        accountId: number | null;
        nurseId: number | null;
        wardId: number | null;
        demoStartDate: string;
    }) => void;
    setAccountMeLoading: () => void;
    setAccountMeSuccess: (account: TAccount) => void;
    setAccountMeError: () => void;
    setDemoExpired: (expired: boolean) => void;
    markHydrated: () => void;
    resetState: () => void;
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
const useAuthStore = create<IStore>()(
    devtools(
        persist(
            (set, get) => {
                const {set: setField, patch} = createStoreWriteHelpers<IState, IStore>({
                    set,
                    get,
                    initialState,
                });

                return {
                    ...initialState,
                    beginLogin: (accessToken, options) =>
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
                    setAccountMeLoading: () => setField('accountMeStatus', 'loading'),
                    setAccountMeSuccess: (account) =>
                        patch({
                            accountMe: account,
                            wardId: account.wardId,
                            accountId: account.accountId,
                            nurseId: account.nurseId,
                            isAuth: true,
                            accountMeStatus: 'success',
                        }),
                    setAccountMeError: () => setField('accountMeStatus', 'error'),
                    setDemoExpired: (expired) => setField('isDemoExpired', expired),
                    markHydrated: () => setField('_loaded', true),
                    resetState: () =>
                        patch({
                            ...initialState,
                            _loaded: true,
                        }),
                };
            },
            {
                name: 'useAuthStore',
                storage: authStoreStorage,
                partialize: ({isAuth, accessToken, accountId, nurseId, wardId, demoStartDate}: IStore): TPersistedAuthState => {
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
                    (rehydratedState ?? state).markHydrated();
                },
            },
        ),
    ),
);

export default useAuthStore;
