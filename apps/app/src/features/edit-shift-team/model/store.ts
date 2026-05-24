import {createStore} from '@/shared/util/create-store';

export type TNurseDrawerMode = 'create' | 'edit';
export type TNurseSaveStatus = 'idle' | 'saving' | 'success' | 'error';

const initialState = {
    selectedNurseId: null as number | null,
    selectedNurseDrawerMode: 'edit' as TNurseDrawerMode,
    isNurseDraftDirty: false,
    nurseSaveStatus: 'idle' as TNurseSaveStatus,
    isAddingNurse: false,
    isDeletingNurse: false,
};
const useEditNurseStore = createStore(initialState, {
    name: 'useEditNurseStore',
    persist: false,
    actions: ({patch}) => ({
        beginAddingNurse: () =>
            patch({
                isAddingNurse: true,
            }),
        completeAddingNurse: (selectedNurseId: number) =>
            patch({
                selectedNurseId,
                selectedNurseDrawerMode: 'create',
                isNurseDraftDirty: false,
                nurseSaveStatus: 'idle',
            }),
        finishAddingNurse: () =>
            patch({
                isAddingNurse: false,
            }),
        beginDeletingNurse: () =>
            patch({
                isDeletingNurse: true,
            }),
        completeDeletingNurse: () =>
            patch({
                selectedNurseId: null,
                selectedNurseDrawerMode: 'edit',
                isNurseDraftDirty: false,
                nurseSaveStatus: 'idle',
            }),
        finishDeletingNurse: () =>
            patch({
                isDeletingNurse: false,
            }),
        selectNurse: (selectedNurseId: number | null, selectedNurseDrawerMode: TNurseDrawerMode = 'edit') =>
            patch({
                selectedNurseId,
                selectedNurseDrawerMode: selectedNurseId === null ? 'edit' : selectedNurseDrawerMode,
                isNurseDraftDirty: false,
                nurseSaveStatus: 'idle',
            }),
        beginSavingNurse: () =>
            patch({
                nurseSaveStatus: 'saving',
            }),
        completeSavingNurse: () =>
            patch({
                isNurseDraftDirty: false,
                nurseSaveStatus: 'success',
                selectedNurseDrawerMode: 'edit',
            }),
        failSavingNurse: () =>
            patch({
                nurseSaveStatus: 'error',
            }),
        setNurseDraftDirty: (isDirty: boolean) => {
            const prev = useEditNurseStore.getState();

            if (prev.isNurseDraftDirty === isDirty) {
                return;
            }

            patch({
                isNurseDraftDirty: isDirty,
                nurseSaveStatus: isDirty && prev.nurseSaveStatus !== 'saving' ? 'idle' : prev.nurseSaveStatus,
            });
        },
    }),
});

export default useEditNurseStore;
