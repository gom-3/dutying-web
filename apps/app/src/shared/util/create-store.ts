import type {StateCreator, StoreApi, UseBoundStore} from 'zustand';
import {devtools, persist, type PersistOptions} from 'zustand/middleware';
import {shallow} from 'zustand/shallow';
import {createWithEqualityFn} from 'zustand/traditional';

export type TStorePatch<S extends object> = Partial<S> | ((prev: S) => Partial<S>);

export type TStoreWriteHelpers<S extends object> = {
    set: <K extends keyof S>(key: K, value: S[K]) => void;
    patch: (partial: TStorePatch<S>) => void;
    reset: () => void;
    getState: () => S;
};

export type TUnsafeStoreMutators<S extends object> = {
    unsafeSetState: <K extends keyof S>(key: K, value: S[K]) => void;
    unsafePatch: (partial: TStorePatch<S>) => void;
};

export type TStoreOf<S extends object, A extends object = {}, TUnsafe extends boolean = false> = S &
    A & {
        reset: () => void;
    } & (TUnsafe extends true ? TUnsafeStoreMutators<S> : object);

type TOptions<S extends object, A extends object, TUnsafe extends boolean, TPersistedState extends object> = {
    name: string;
    actions?: (helpers: TStoreWriteHelpers<S>) => A;
    persist?: boolean;
    devtools?: boolean;
    unsafeMutators?: TUnsafe;
    persistOptions?: Omit<PersistOptions<TStoreOf<S, A, TUnsafe>, TPersistedState>, 'name'>;
    equalityFn?: typeof shallow;
};

function pickState<S extends object, TStore extends Record<keyof S, unknown>>(store: TStore, stateKeys: Array<keyof S>): S {
    return stateKeys.reduce<Partial<S>>((acc, key) => {
        acc[key] = store[key] as unknown as S[typeof key];

        return acc;
    }, {}) as S;
}

export function createStoreWriteHelpers<S extends object, TStore extends Record<keyof S, unknown>>({
    set,
    get,
    initialState,
}: {
    set: StoreApi<TStore>['setState'];
    get: StoreApi<TStore>['getState'];
    initialState: S;
}): TStoreWriteHelpers<S> {
    const stateKeys = Object.keys(initialState) as Array<keyof S>;
    const toState = (store: TStore) => pickState<S, TStore>(store, stateKeys);

    return {
        set: (key, value) => set((prev) => ({...prev, [key]: value})),
        patch: (partial) =>
            set((prev) => {
                const prevState = toState(prev);
                const nextPartial = typeof partial === 'function' ? partial(prevState) : partial;

                return {...prev, ...nextPartial};
            }),
        reset: () => set((prev) => ({...prev, ...initialState})),
        getState: () => toState(get()),
    };
}

// Store standard:
// - keep generic set/patch private to the store factory
// - expose explicit actions from the public store API
// - reserve unsafe mutators for temporary migration paths only
// - allow persist partialize to narrow the stored shape when needed
export function createStore<S extends object, A extends object = {}, TUnsafe extends boolean = false, TPersistedState extends object = S>(
    initialState: S,
    opts: TOptions<S, A, TUnsafe, TPersistedState>,
): UseBoundStore<StoreApi<TStoreOf<S, A, TUnsafe>>> {
    const {
        name,
        actions: createActions,
        persist: usePersist = false,
        devtools: useDevtools = true,
        unsafeMutators = false as TUnsafe,
        persistOptions,
        equalityFn = shallow,
    } = opts;
    const stateKeys = Object.keys(initialState) as Array<keyof S>;
    const baseCreator: StateCreator<TStoreOf<S, A, TUnsafe>> = (set, get) => {
        const helpers = createStoreWriteHelpers<S, TStoreOf<S, A, TUnsafe>>({
            set,
            get,
            initialState,
        });
        const actions = (createActions?.(helpers) ?? {}) as A;
        const unsafe = unsafeMutators
            ? ({
                  unsafeSetState: helpers.set,
                  unsafePatch: helpers.patch,
              } as TUnsafeStoreMutators<S>)
            : {};

        return {
            ...initialState,
            ...actions,
            ...unsafe,
            reset: helpers.reset,
        } as TStoreOf<S, A, TUnsafe>;
    };
    const withPersist = usePersist
        ? (() => {
              const resolvedPersistOptions = {
                  name,
                  ...persistOptions,
              } as PersistOptions<TStoreOf<S, A, TUnsafe>, TPersistedState>;

              if (!resolvedPersistOptions.partialize) {
                  resolvedPersistOptions.partialize = (state) =>
                      pickState<S, TStoreOf<S, A, TUnsafe>>(state, stateKeys) as unknown as TPersistedState;
              }

              return persist(baseCreator, resolvedPersistOptions) as StateCreator<TStoreOf<S, A, TUnsafe>>;
          })()
        : baseCreator;
    const withDevtools = useDevtools ? devtools(withPersist, {name}) : withPersist;

    return createWithEqualityFn<TStoreOf<S, A, TUnsafe>>(withDevtools as StateCreator<TStoreOf<S, A, TUnsafe>>, equalityFn);
}
