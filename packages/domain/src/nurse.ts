import type {TDay} from './shift';

export type TNurseShiftType = {
    nurseShiftTypeId: number;
    name: string;
    shortName: string;
    isPossible: boolean;
    isPreferred: boolean;
};

export type TDayShift = {
    day: TDay;
    shiftId: number;
};

export type TNurse = {
    nurseId: number;
    accountId: number | null;
    shiftTeamId: number | null;
    wardId: number;
    name: string;
    phoneNum: string;
    isConnected: boolean;
    nurseShiftTypes: TNurseShiftType[];
    isWorker: boolean;
    isDutyManager: boolean;
    isWardManager: boolean;
    gender: string;
    employmentDate: string;
    memo: string;
    isDeleted: boolean;
    divisionNum: number;
    priority: number;
};

export type TWaitingNurse = {
    waitingNurseId: number;
    nurseId: number;
    name: string;
    gender: string;
    phoneNum: string;
    employmentDate: string;
    /** @deprecated use profileImgUrl */
    profileImgBase64?: string;
    profileImgUrl: string;
};
