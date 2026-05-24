import {queryOptions} from '@tanstack/react-query';
import {WardAPI} from '@/shared/api';

export const wardQueryKeys = {
    all: () => ['ward'],
    // Ward
    id: (wardId: number) => [...wardQueryKeys.all(), 'id', wardId],
    searched: (code: string) => [...wardQueryKeys.all(), 'searched', code],
    waitingNurses: (wardId: number) => [...wardQueryKeys.all(), 'waitingNurses', wardId],
    constraint: (wardId: number, shiftTeamId: number) => [...wardQueryKeys.all(), 'constraint', wardId, shiftTeamId],
    // Shift
    duty: (wardId: number, shiftTeamId: number, year: number, month: number) => [
        ...wardQueryKeys.all(),
        'duty',
        wardId,
        shiftTeamId,
        year,
        month,
    ],
    request: (wardId: number, shiftTeamId: number, year: number, month: number) => [
        ...wardQueryKeys.all(),
        'request',
        wardId,
        shiftTeamId,
        year,
        month,
    ],
    requestList: (wardId: number, shiftTeamId: number, year: number, month: number) => [
        ...wardQueryKeys.all(),
        'requestList',
        wardId,
        shiftTeamId,
        year,
        month,
    ],
    shift: () => [...wardQueryKeys.all(), 'shift'],
    // ShiftTeam
    shiftTeams: (wardId: number) => [...wardQueryKeys.all(), 'shiftTeams', wardId],
    shiftTeamNurses: (wardId: number, shiftTeamId: number) => [...wardQueryKeys.all(), 'shiftTeamNurses', wardId, shiftTeamId],
    // ShiftType
    shiftTypes: (wardId: number) => [...wardQueryKeys.all(), 'shiftTypes', wardId],
};

export const wardQueryOptions = {
    // Ward
    id: (wardId: number) =>
        queryOptions({
            queryKey: wardQueryKeys.id(wardId),
            queryFn: () => WardAPI.getWard(wardId),
        }),
    searched: (code: string) =>
        queryOptions({
            queryKey: wardQueryKeys.searched(code),
            queryFn: () => WardAPI.getWardByCode(code),
        }),
    waitingNurses: (wardId: number) =>
        queryOptions({
            queryKey: wardQueryKeys.waitingNurses(wardId),
            queryFn: () => WardAPI.getWaitingNurses(wardId),
        }),
    constraint: (wardId: number, shiftTeamId: number) =>
        queryOptions({
            queryKey: wardQueryKeys.constraint(wardId, shiftTeamId),
            queryFn: () => WardAPI.getWardConstraint(wardId, shiftTeamId),
        }),
    // Shift
    duty: (wardId: number, shiftTeamId: number, year: number, month: number) =>
        queryOptions({
            queryKey: wardQueryKeys.duty(wardId, shiftTeamId, year, month),
            queryFn: () => WardAPI.getShift(wardId, shiftTeamId, year, month),
        }),
    request: (wardId: number, shiftTeamId: number, year: number, month: number) =>
        queryOptions({
            queryKey: wardQueryKeys.request(wardId, shiftTeamId, year, month),
            queryFn: () => WardAPI.getReqShift(wardId, shiftTeamId, year, month),
        }),
    requestList: (wardId: number, shiftTeamId: number, year: number, month: number) =>
        queryOptions({
            queryKey: wardQueryKeys.requestList(wardId, shiftTeamId, year, month),
            queryFn: () => WardAPI.getRequestList(wardId, shiftTeamId, year, month),
        }),
    // ShiftTeam
    shiftTeams: (wardId: number) =>
        queryOptions({
            queryKey: wardQueryKeys.shiftTeams(wardId),
            queryFn: () => WardAPI.getShiftTeams(wardId),
        }),
    shiftTeamNurses: (wardId: number, shiftTeamId: number) =>
        queryOptions({
            queryKey: wardQueryKeys.shiftTeamNurses(wardId, shiftTeamId),
            queryFn: () => WardAPI.getShiftTeamNurses(wardId, shiftTeamId),
        }),
    // ShiftType
    shiftTypes: (wardId: number) =>
        queryOptions({
            queryKey: wardQueryKeys.shiftTypes(wardId),
            queryFn: () => WardAPI.getShiftTypes(wardId),
        }),
};
