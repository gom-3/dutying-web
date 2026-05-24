import {create} from 'zustand';
import type {TDraftSaveStatus} from './persistence';

type TShiftEditorDraftStatusStore = {
    status: TDraftSaveStatus;
    setStatus: (status: TDraftSaveStatus) => void;
};

export const useShiftEditorDraftStatusStore = create<TShiftEditorDraftStatusStore>((set) => ({
    status: 'idle',
    setStatus: (status) => set({status}),
}));
