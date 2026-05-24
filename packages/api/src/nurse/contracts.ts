import type {TNurse} from '@dutying/domain';

export type TNurseResponse = TNurse;

export interface INurseAPI {
    getNurse: (nurseId: number) => Promise<TNurseResponse>;
    createAccountNurse: (accountId: number, createNurse: TCreateNurseDTO) => Promise<TNurseResponse>;
    connectNurse: (nurseId: number) => Promise<void>;
    updateNurse: (nurseId: number, updatedNurse: TUpdateNurseDTO) => Promise<TNurseResponse>;
    updateNurseStatus: (nurseId: number, status: string) => Promise<TNurseResponse>;
    updateNurseOrder: (
        nurseId: number,
        shiftTeamId: number,
        nextShiftTeamId: number,
        divisionNum: number,
        prevPriority: number,
        nextPriority: number,
        patchYearMonth: string,
    ) => Promise<void>;
    updateShiftTeamDivision: (shiftTeamId: number, prevPriority: number, changeValue: number, patchYearMonth: string) => Promise<void>;
    updateNurseShiftType: (nurseId: number, nurseShiftTypeId: number, change: TUpdateNurseShiftTypeRequest) => Promise<void>;
    updateNurseCarry: (shiftNurseId: number, value: number) => Promise<void>;
    unConnectNurse: (nurseId: number) => Promise<void>;
}

export type TCreateNurseDTO = {
    name: string;
    phoneNum: string;
    gender: string;
    isWorker: boolean;
    employmentDate: string;
};

export type TUpdateNurseDTO = {
    name: string;
    phoneNum: string;
    gender: string;
    isWorker: boolean;
    employmentDate: string;
    isDutyManager: boolean;
    isWardManager: boolean;
    memo: string;
};

export type TUpdateNurseShiftTypeRequest = {
    isPossible?: boolean;
    isPrefer?: boolean;
};
