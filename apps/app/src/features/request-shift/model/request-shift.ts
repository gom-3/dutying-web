import {type TDutyRequest, type TRequestShift} from '@/entities/shift';
import {type TWardShiftType} from '@/entities/ward';
import {type TFocus, type TRequestShiftEditAvailability} from './types';

type TBootstrapStatus = 'pending' | 'error' | 'success';
type TAccountMeStatus = 'idle' | 'loading' | 'success' | 'error';
type TMonthChangeType = 'prev' | 'next';

type TBootstrapStatusParams = {
    _loaded: boolean;
    isAuth: boolean;
    wardId: number | null;
    accountMeStatus: TAccountMeStatus;
};

type TMonthChangeDecisionParams = {
    year: number;
    month: number;
    type: TMonthChangeType;
    readonly: boolean;
    targetAvailability: TRequestShiftEditAvailability;
};

type TMonthChangeDecision = {
    year: number;
    month: number;
    shouldBlock: boolean;
    shouldEnableReadonly: boolean;
    feedbackMessage: string | null;
};

const flattenRequestShiftRows = (requestShift: TRequestShift) => requestShift.divisionShiftNurses.flatMap((division) => division);

export const getRequestShiftBootstrapStatus = ({_loaded, isAuth, wardId, accountMeStatus}: TBootstrapStatusParams): TBootstrapStatus => {
    if (!_loaded || (isAuth && wardId === null && (accountMeStatus === 'idle' || accountMeStatus === 'loading'))) {
        return 'pending';
    }

    if (isAuth && wardId === null && accountMeStatus === 'error') {
        return 'error';
    }

    return 'success';
};

export const createInitialFoldedLevels = (requestShift: TRequestShift) => requestShift.divisionShiftNurses.map(() => false);

export const shouldResetFoldedLevelsOnRequestLoad = ({
    foldedLevels,
    previousShiftTeamId,
    currentShiftTeamId,
}: {
    foldedLevels: boolean[] | null;
    previousShiftTeamId: number | null;
    currentShiftTeamId: number | null;
}) => {
    return !foldedLevels || !previousShiftTeamId || previousShiftTeamId !== currentShiftTeamId;
};

export const shouldSyncFoldedLevelsLength = ({
    foldedLevels,
    requestShift,
}: {
    foldedLevels: boolean[] | null;
    requestShift: TRequestShift;
}) => {
    return foldedLevels !== null && foldedLevels.length !== requestShift.divisionShiftNurses.length;
};

export const createWardShiftTypeMap = (requestShift: TRequestShift) => {
    return new Map<number, TWardShiftType>(
        requestShift.wardShiftTypes.map((wardShiftType) => [wardShiftType.wardShiftTypeId, wardShiftType]),
    );
};

export const getAdjacentRequestShiftDate = (year: number, month: number, type: TMonthChangeType) => {
    if (type === 'prev') {
        return month === 1
            ? {
                  year: year - 1,
                  month: 12,
              }
            : {
                  year,
                  month: month - 1,
              };
    }

    return month === 12
        ? {
              year: year + 1,
              month: 1,
          }
        : {
              year,
              month: month + 1,
          };
};

export const getRequestShiftMonthChangeDecision = ({
    year,
    month,
    type,
    readonly,
    targetAvailability,
}: TMonthChangeDecisionParams): TMonthChangeDecision => {
    const nextDate = getAdjacentRequestShiftDate(year, month, type);

    if (type === 'prev' && !readonly && targetAvailability.status === 'lockedPast') {
        return {
            ...nextDate,
            shouldBlock: false,
            shouldEnableReadonly: true,
            feedbackMessage: targetAvailability.validationMessage,
        };
    }

    if (type === 'next' && targetAvailability.status === 'lockedFuture') {
        return {
            ...nextDate,
            shouldBlock: true,
            shouldEnableReadonly: false,
            feedbackMessage: targetAvailability.validationMessage,
        };
    }

    return {
        ...nextDate,
        shouldBlock: false,
        shouldEnableReadonly: false,
        feedbackMessage: null,
    };
};

export const findRequestShiftRow = (requestShift: TRequestShift, shiftNurseId: number) => {
    return flattenRequestShiftRows(requestShift).find((row) => row.shiftNurse.shiftNurseId === shiftNurseId) ?? null;
};

export const getRequestShiftTypeIdAtFocus = (requestShift: TRequestShift, focus: TFocus) => {
    return findRequestShiftRow(requestShift, focus.shiftNurseId)?.wardReqShiftList[focus.day];
};

export const findDutyRequestByFocus = (dutyRequestList: TDutyRequest[] | undefined, requestShift: TRequestShift, focus: TFocus) => {
    const nurseId = findRequestShiftRow(requestShift, focus.shiftNurseId)?.shiftNurse.nurseId;

    if (nurseId === undefined) return undefined;

    return dutyRequestList?.find((dutyRequest) => dutyRequest.nurseId === nurseId && dutyRequest.date === focus.day);
};

export const getRequestShiftChangeEventMessage = ({
    focus,
    prevShiftType,
    nextShiftType,
}: {
    focus: TFocus;
    prevShiftType: TWardShiftType | null;
    nextShiftType: TWardShiftType | null;
}) => {
    const changeLabel =
        prevShiftType === null
            ? `추가 → ${nextShiftType?.shortName}`
            : nextShiftType === null
              ? `${prevShiftType.shortName} → 삭제`
              : `${prevShiftType.shortName} → ${nextShiftType.shortName}`;

    return `${focus.shiftNurseName} / ${focus.day + 1}일 | ${changeLabel}`;
};
