import {type TRequestShift} from '@/entities/shift';
import {type TShiftTeam, type TWardShiftType} from '@/entities/ward';
import {createStore} from '@/shared/util/create-store';
import {
    createInitialFoldedLevels,
    createWardShiftTypeMap,
    resolveCurrentRequestShiftTeamId,
    shouldResetFoldedLevelsOnRequestLoad,
    shouldSyncFoldedLevelsLength,
} from './request-shift';
import {type TFocus} from './types';

type TChangeStatus = 'idle' | 'loading' | 'success' | 'error';

interface IState {
    year: number;
    month: number;
    focus: TFocus | null;
    foldedLevels: boolean[] | null;
    currentShiftTeamId: number | null;
    oldCurrentShiftTeamId: number | null;
    wardShiftTypeMap: Map<number, TWardShiftType> | null;
    readonly: boolean;
    changeStatus: TChangeStatus;
    updatingRequestId: number | null;
}

type TPersistedRequestShiftState = Pick<IState, 'year' | 'month' | 'currentShiftTeamId' | 'oldCurrentShiftTeamId'>;

const now = new Date();
const initialState: IState = {
    year: now.getMonth() + 1 === 12 ? now.getFullYear() + 1 : now.getFullYear(),
    month: now.getMonth() + 1 === 12 ? 1 : now.getMonth() + 2,
    focus: null,
    currentShiftTeamId: null,
    oldCurrentShiftTeamId: null,
    foldedLevels: null,
    wardShiftTypeMap: null,
    readonly: true,
    changeStatus: 'idle',
    updatingRequestId: null,
};

export const useRequestShiftStore = createStore<
    IState,
    {
        syncShiftTeams: (shiftTeams: TShiftTeam[]) => void;
        loadRequestShift: (requestShift: TRequestShift) => void;
        setCalendarDate: (year: number, month: number) => void;
        selectFocus: (focus: TFocus | null) => void;
        toggleFoldedLevel: (level: number) => void;
        enterEditMode: () => void;
        enterReadonlyMode: (requestShift?: TRequestShift) => void;
        selectShiftTeam: (shiftTeamId: number | null) => void;
        startRequestChange: () => void;
        completeRequestChange: (status: Exclude<TChangeStatus, 'idle' | 'loading'>) => void;
        resetRequestChangeStatus: () => void;
        startRequestDecision: (requestId: number) => void;
        finishRequestDecision: () => void;
    },
    false,
    TPersistedRequestShiftState
>(initialState, {
    name: 'useRequestShiftStore',
    persist: true,
    actions: ({patch}) => ({
        syncShiftTeams: (shiftTeams) =>
            patch((prev) => ({
                currentShiftTeamId: resolveCurrentRequestShiftTeamId({
                    shiftTeams,
                    currentShiftTeamId: prev.currentShiftTeamId,
                }),
            })),
        loadRequestShift: (requestShift) =>
            patch((prev) => {
                const shouldResetFoldedLevels = shouldResetFoldedLevelsOnRequestLoad({
                    foldedLevels: prev.foldedLevels,
                    previousShiftTeamId: prev.oldCurrentShiftTeamId,
                    currentShiftTeamId: prev.currentShiftTeamId,
                });
                const nextFoldedLevels =
                    shouldResetFoldedLevels || shouldSyncFoldedLevelsLength({foldedLevels: prev.foldedLevels, requestShift})
                        ? createInitialFoldedLevels(requestShift)
                        : prev.foldedLevels;

                return {
                    foldedLevels: nextFoldedLevels,
                    oldCurrentShiftTeamId: shouldResetFoldedLevels ? prev.currentShiftTeamId : prev.oldCurrentShiftTeamId,
                    wardShiftTypeMap: createWardShiftTypeMap(requestShift),
                };
            }),
        setCalendarDate: (year, month) =>
            patch({
                year,
                month,
            }),
        selectFocus: (focus) =>
            patch({
                focus,
            }),
        toggleFoldedLevel: (level) =>
            patch((prev) => ({
                foldedLevels: prev.foldedLevels?.map((isFolded, index) => (index === level ? !isFolded : isFolded)) ?? prev.foldedLevels,
            })),
        enterEditMode: () =>
            patch({
                readonly: false,
            }),
        enterReadonlyMode: (requestShift) =>
            patch((prev) => ({
                readonly: true,
                focus: null,
                foldedLevels: requestShift ? createInitialFoldedLevels(requestShift) : prev.foldedLevels,
            })),
        selectShiftTeam: (shiftTeamId) =>
            patch({
                currentShiftTeamId: shiftTeamId,
            }),
        startRequestChange: () =>
            patch({
                changeStatus: 'loading',
            }),
        completeRequestChange: (status) =>
            patch({
                changeStatus: status,
            }),
        resetRequestChangeStatus: () =>
            patch({
                changeStatus: 'idle',
            }),
        startRequestDecision: (requestId) =>
            patch({
                updatingRequestId: requestId,
            }),
        finishRequestDecision: () =>
            patch({
                updatingRequestId: null,
            }),
    }),
    persistOptions: {
        partialize: ({year, month, currentShiftTeamId, oldCurrentShiftTeamId}): TPersistedRequestShiftState => ({
            year,
            month,
            currentShiftTeamId,
            oldCurrentShiftTeamId,
        }),
    },
});
