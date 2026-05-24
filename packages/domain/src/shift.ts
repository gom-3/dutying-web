import type {TShiftNurse, TWardShiftType} from './ward';

export type TDayType = 'saturday' | 'sunday' | 'holiday' | 'workday';

export type TDay = {
    day: number;
    dayType: TDayType;
};

export type TRow = {
    shiftNurse: TShiftNurse;
    lastWardShiftList: (number | null)[];
    lastWardReqShiftList: (number | null)[];
    wardShiftList: (number | null)[];
    wardReqShiftList: (number | null)[];
};

export type TShift = {
    lastDays: TDay[];
    days: TDay[];
    wardShiftTypes: TWardShiftType[];
    divisionShiftNurses: TRow[][];
};

export type TRequestShift = {
    days: TDay[];
    wardShiftTypes: TWardShiftType[];
    divisionShiftNurses: {
        shiftNurse: TShiftNurse;
        carry: number;
        wardReqShiftList: (number | null)[];
    }[][];
};

export type TDutyRequest = {
    wardReqShiftId: number;
    nurseId: number;
    nurseName: string;
    date: number;
    requestDate: string;
    wardShiftTypeId: number;
    wardShiftTypeShortName: string;
    wardShiftTypeColor: string;
    isRead: boolean;
    isAccepted: boolean | null;
};
