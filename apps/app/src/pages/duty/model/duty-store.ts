import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {type TShift, type TShiftTeam} from '@/entities';

export type TDutyStatus = 'idle' | 'pending' | 'success' | 'error';

type TDutyStore = {
    year: number;
    month: number;
    shiftTeams: TShiftTeam[];
    currentShiftTeamId: number | null;
    readonly: boolean;
    shift: TShift | null;
    status: TDutyStatus;
    setYearMonth: (payload: {year: number; month: number}) => void;
    goPrevMonth: () => void;
    goNextMonth: () => void;
    setShiftTeams: (teams: TShiftTeam[]) => void;
    setCurrentShiftTeamId: (shiftTeamId: number | null) => void;
    setReadonly: (readonly: boolean) => void;
    setShift: (shift: TShift | null) => void;
    setStatus: (status: TDutyStatus) => void;
};

const now = new Date();

export const useDutyStore = create<TDutyStore>()(
    devtools((set, get) => ({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        shiftTeams: [],
        currentShiftTeamId: null,
        readonly: true,
        shift: null,
        status: 'idle',
        setYearMonth: ({year, month}) =>
            set(() => ({
                year,
                month: Math.min(12, Math.max(1, month)),
            })),
        goPrevMonth: () => {
            const {year, month} = get();

            if (month <= 1) {
                set(() => ({year: year - 1, month: 12}));

                return;
            }

            set(() => ({month: month - 1}));
        },
        goNextMonth: () => {
            const {year, month} = get();

            if (month >= 12) {
                set(() => ({year: year + 1, month: 1}));

                return;
            }

            set(() => ({month: month + 1}));
        },
        setShiftTeams: (shiftTeams) => set(() => ({shiftTeams})),
        setCurrentShiftTeamId: (currentShiftTeamId) => set(() => ({currentShiftTeamId})),
        setReadonly: (readonly) => set(() => ({readonly})),
        setShift: (shift) => set(() => ({shift})),
        setStatus: (status) => set(() => ({status})),
    })),
);
