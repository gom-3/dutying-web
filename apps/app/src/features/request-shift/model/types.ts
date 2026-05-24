import type {TNurse, TWardShiftType} from '@/entities';

export type TFocus = {
    shiftNurseName: string;
    shiftNurseId: number;
    day: number;
};

export type TDayInfo = {
    countByShiftList: {count: number; shiftType: TWardShiftType}[];
    month: number;
    day: number;
    nurse: TNurse;
    message: string;
};

export type TEditHistory = Map<
    string,
    {
        current: number;
        history: {
            nurseName: string;
            focus: TFocus;
            prevShiftType: TWardShiftType | null;
            nextShiftType: TWardShiftType | null;
            dateString: string;
        }[];
    }
>;

export type TFaultType =
    | 'maxContinuousWork'
    | 'minNightInterval'
    | 'maxContinuousNight'
    | 'minContinuousNight'
    | 'minOffAssignAfterNight'
    | 'excludeCertainWorkTypes'
    | 'excludeNightBeforeReqOff';

export type TCheckFaultOptions = {
    [key in TFaultType]: {
        type: 'wrong' | 'bad';
        label: string;
        isActive: boolean;
        regExp: RegExp;
        message: string;
        value: number | null;
    };
};

export type TFault = {
    type: 'wrong' | 'bad';
    faultType: TFaultType;
    message: string;
    nurseName: string;
    focus: TFocus;
    matchString: string;
    length: number;
};

export type TFaults = Map<string, TFault>;

export type TRequestShiftEditAvailability = {
    canEdit: boolean;
    status: 'editable' | 'lockedPast' | 'lockedFuture';
    validationMessage: string | null;
    badgeLabel: string;
    periodLabel: string;
    description: string;
};
