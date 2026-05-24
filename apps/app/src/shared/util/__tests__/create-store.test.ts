import {afterEach, describe, expect, it} from 'vitest';
import {createStore} from '../create-store';

describe('createStore', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('exposes explicit actions while keeping persisted payload limited to state keys', () => {
        const useCounterStore = createStore(
            {
                count: 0,
                label: 'idle',
            },
            {
                name: 'useCounterStore',
                persist: true,
                actions: ({patch, reset}) => ({
                    increase: () => patch((prev) => ({count: prev.count + 1, label: 'updated'})),
                    resetCounter: reset,
                }),
            },
        );

        useCounterStore.getState().increase();

        expect(useCounterStore.getState()).toMatchObject({
            count: 1,
            label: 'updated',
        });
        expect(useCounterStore.getState().resetCounter).toBeTypeOf('function');

        const persisted = JSON.parse(localStorage.getItem('useCounterStore') ?? '{}');

        expect(persisted.state).toEqual({
            count: 1,
            label: 'updated',
        });
        expect('unsafePatch' in useCounterStore.getState()).toBe(false);
        expect('unsafeSetState' in useCounterStore.getState()).toBe(false);
    });

    it('supports narrowed persist payloads through custom partialize typing', () => {
        const useSessionStore = createStore<
            {token: string | null; profileId: number | null; transientError: string | null},
            {setSession: (token: string, profileId: number) => void},
            false,
            {token: string | null; profileId: number | null}
        >(
            {
                token: null,
                profileId: null,
                transientError: null,
            },
            {
                name: 'useSessionStore',
                persist: true,
                actions: ({patch}) => ({
                    setSession: (token, profileId) =>
                        patch({
                            token,
                            profileId,
                        }),
                }),
                persistOptions: {
                    partialize: ({token, profileId}) => ({
                        token,
                        profileId,
                    }),
                },
            },
        );

        useSessionStore.getState().setSession('token', 7);

        const persisted = JSON.parse(localStorage.getItem('useSessionStore') ?? '{}');

        expect(persisted.state).toEqual({
            token: 'token',
            profileId: 7,
        });
        expect(persisted.state.transientError).toBeUndefined();
    });

    it('only exposes unsafe mutators when a store opts into the migration escape hatch', () => {
        const useDraftStore = createStore(
            {
                value: 1,
            },
            {
                name: 'useDraftStore',
                unsafeMutators: true,
            },
        );

        useDraftStore.getState().unsafePatch({
            value: 3,
        });

        expect(useDraftStore.getState().value).toBe(3);
        expect('unsafePatch' in useDraftStore.getState()).toBe(true);
    });
});
