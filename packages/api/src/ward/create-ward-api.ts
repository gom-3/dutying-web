import type {IApiClient} from '../client';
import type {
    IWardAPI,
    TCreateWardChatMessageDTO,
    TCreateShiftTypeDTO,
    TCreateWardDTO,
    TDutyRequestResponse,
    TEditWardDTO,
    TReadWardChatDTO,
    TRequestShiftResponse,
    TShiftConstraintRuleCandidatesResponse,
    TShiftResponse,
    TShiftTeamResponse,
    TUpdateShiftTeamDTO,
    TWaitingNurseResponse,
    TWardChatMessageResponse,
    TWardChatMessagesResponse,
    TWardChatUnreadCountResponse,
    TWardConstraintDTO,
    TWardConstraintResponse,
    TWardResponse,
    TWardShiftTypeResponse,
    TWardShiftsDTO,
} from './contracts';
import type {TNurseResponse} from '../nurse';

const toYearMonthQuery = (year: number, month: number) =>
    new URLSearchParams({
        year: String(year),
        month: String(month),
    }).toString();

const toPostShiftQuery = (year: number, month: number) =>
    new URLSearchParams({
        year: String(year),
        month: month.toString().padStart(2, '0'),
    }).toString();

const toChatMessagesQuery = (cursorMessageId?: number, size?: number) => {
    const params = new URLSearchParams();

    if (typeof cursorMessageId === 'number') params.set('cursorMessageId', String(cursorMessageId));

    if (typeof size === 'number') params.set('size', String(size));

    return params.toString();
};

const toIsoDate = (year: number, month: number, day: number) =>
    `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

export const createWardApi = (client: IApiClient): IWardAPI => ({
    getWard: async (wardId: number) => (await client.get<TWardResponse>(`/wards/${wardId}`)).data,
    createWard: async (createWardDTO: TCreateWardDTO) => (await client.post<TWardResponse>(`/wards`, createWardDTO)).data,
    editWard: async (wardId: number, ward: TEditWardDTO) => (await client.patch<TWardResponse>(`/wards/${wardId}`, ward)).data,
    getWardConstraint: async (wardId: number, shiftTeamId: number) =>
        (await client.get<TWardConstraintResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}/constraint`)).data,
    getShiftConstraintRuleCandidates: async (wardId: number, shiftTeamId: number) =>
        (
            await client.get<TShiftConstraintRuleCandidatesResponse>(
                `/wards/${wardId}/shift-teams/${shiftTeamId}/shift-constraint-rules/candidates`,
            )
        ).data,
    updateWardConstraint: async (wardId: number, shiftTeamId: number, constraint: TWardConstraintDTO) =>
        (await client.patch<TWardConstraintResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}/constraint`, constraint)).data,
    getWardByCode: async (code: string) => (await client.get<TWardResponse>(`/wards/search?${new URLSearchParams({code}).toString()}`)).data,
    getWaitingNurses: async (wardId: number) =>
        (await client.get<{nurses: TWaitingNurseResponse[]}>(`/wards/${wardId}/waiting-nurses/v2`)).data.nurses,
    addMeToWaitingNurses: async (wardId: number) => (await client.post<void>(`/wards/${wardId}/waiting-nurses`)).data,
    connectWaitingNurses: async (wardId: number, waitingNurseId: number, targetNurseId: number) =>
        (await client.post<void>(`/wards/${wardId}/waiting-nurses/${waitingNurseId}/connect?targetNurseId=${targetNurseId}`)).data,
    approveWaitingNurses: async (wardId: number, waitingNurseId: number, shiftTeamId: number) =>
        (await client.post<void>(`/wards/${wardId}/waiting-nurses/${waitingNurseId}/approve?shiftTeamId=${shiftTeamId}`)).data,
    deleteWaitingNurses: async (wardId: number, nurseId: number) =>
        (await client.delete<void>(`/wards/${wardId}/waiting-nurses?nurseId=${nurseId}`)).data,
    quitWard: async (wardId: number) => (await client.delete<void>(`/wards/${wardId}/quit`)).data,
    getReqShift: async (wardId: number, shiftTeamId: number, year: number, month: number) =>
        (await client.get<TRequestShiftResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty?${toYearMonthQuery(year, month)}`)).data,
    getShift: async (wardId: number, shiftTeamId: number, year: number, month: number) =>
        (await client.get<TShiftResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}/duty?${toYearMonthQuery(year, month)}`)).data,
    getRequestList: async (wardId: number, shiftTeamId: number, year: number, month: number) =>
        (await client.get<TDutyRequestResponse[]>(`/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty/req-list?${toYearMonthQuery(year, month)}`)).data,
    updateShift: async (wardId: number, year: number, month: number, day: number, shiftNurseId: number, wardShiftTypeId: number | null) =>
        (
            await client.patch<null>(`/wards/${wardId}/shifts`, {
                shiftNurseId,
                date: toIsoDate(year, month, day),
                wardShiftTypeId,
            })
        ).data,
    updateShifts: async (wardId: number, wardShifts: TWardShiftsDTO) =>
        (
            await client.patch<void>(`/wards/${wardId}/shifts/list`, {
                wardShifts,
            })
        ).data,
    getWardChatMessages: async (wardId: number, options) => {
        const query = toChatMessagesQuery(options?.cursorMessageId, options?.size);

        return (await client.get<TWardChatMessagesResponse>(`/wards/${wardId}/chat/messages${query ? `?${query}` : ''}`)).data;
    },
    createWardChatMessage: async (wardId: number, message: TCreateWardChatMessageDTO) =>
        (await client.post<TWardChatMessageResponse>(`/wards/${wardId}/chat/messages`, message)).data,
    readWardChat: async (wardId: number, read: TReadWardChatDTO) => (await client.put<void>(`/wards/${wardId}/chat/read`, read)).data,
    getWardChatUnreadCount: async (wardId: number) => (await client.get<TWardChatUnreadCountResponse>(`/wards/${wardId}/chat/unread-count`)).data,
    getMyWardChatUnreadCounts: async () => (await client.get<TWardChatUnreadCountResponse[]>(`/wards/chat/unread-counts`)).data,
    updateReqShift: async (
        wardId: number,
        year: number,
        month: number,
        day: number,
        shiftNurseId: number,
        wardShiftTypeId: number | null,
    ) =>
        (
            await client.patch<void>(`/wards/${wardId}/req-shifts`, {
                shiftNurseId,
                date: toIsoDate(year, month, day),
                wardShiftTypeId,
            })
        ).data,
    acceptRequestShift: async (wardId: number, reqShiftId: number, isAccepted: boolean | null) =>
        (
            await client.patch<void>(`/wards/${wardId}/req-shifts/${reqShiftId}/accept`, {
                isAccepted,
            })
        ).data,
    postShift: async (wardId: number, shiftTeamId: number, year: number, month: number) =>
        (await client.post<void>(`/wards/${wardId}/shift-teams/${shiftTeamId}/post?${toPostShiftQuery(year, month)}`)).data,
    getShiftTeamNurses: async (wardId: number, shiftTeamId: number) =>
        (await client.get<{nurses: TShiftTeamResponse['nurses']}>(`/wards/${wardId}/shift-teams/${shiftTeamId}/nurses`)).data.nurses,
    addNurseIntoShiftTeam: async (wardId: number, shiftTeamId: number, addShiftTeamNurseDTO) =>
        (await client.post<TNurseResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}/nurses`, addShiftTeamNurseDTO)).data,
    removeNurseFromShiftTeam: async (wardId: number, shiftTeamId: number, nurseId: number) =>
        (await client.delete<TNurseResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}/nurses/${nurseId}`)).data,
    getShiftTeams: async (wardId: number) => (await client.get<{shiftTeams: TShiftTeamResponse[]}>(`/wards/${wardId}/shift-teams`)).data.shiftTeams,
    createShiftTeam: async (wardId: number) => (await client.post<TShiftTeamResponse>(`/wards/${wardId}/shift-teams`)).data,
    buildShiftTeam: async (wardId: number, shiftTeamId: number, year: number, month: number) =>
        (await client.post<TShiftTeamResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}?${toYearMonthQuery(year, month)}`)).data,
    deleteShiftTeam: async (wardId: number, shiftTeamId: number) =>
        (await client.delete<TShiftTeamResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}`)).data,
    updateShiftTeam: async (wardId: number, shiftTeamId: number, updateShiftTeamDTO: TUpdateShiftTeamDTO) =>
        (await client.patch<TShiftTeamResponse>(`/wards/${wardId}/shift-teams/${shiftTeamId}`, updateShiftTeamDTO)).data,
    getShiftTypes: async (wardId: number) => (await client.get<TWardShiftTypeResponse[]>(`/wards/${wardId}/shift-types`)).data,
    createShiftType: async (wardId: number, createShiftTypeDTO: TCreateShiftTypeDTO) =>
        (await client.post<TWardShiftTypeResponse>(`/wards/${wardId}/shift-types`, createShiftTypeDTO)).data,
    deleteShiftType: async (wardId: number, shiftTypeId: number) => (await client.delete<void>(`/wards/${wardId}/shift-types/${shiftTypeId}`)).data,
    updateShiftType: async (wardId: number, shiftTypeId: number, createShiftTypeDTO: TCreateShiftTypeDTO) =>
        (await client.put<TWardShiftTypeResponse>(`/wards/${wardId}/shift-types/${shiftTypeId}`, createShiftTypeDTO)).data,
    getWatingNurses: async (wardId: number) =>
        (await client.get<{nurses: TWaitingNurseResponse[]}>(`/wards/${wardId}/waiting-nurses/v2`)).data.nurses,
    addMeToWatingNurses: async (wardId: number) => (await client.post<void>(`/wards/${wardId}/waiting-nurses`)).data,
    connectWatingNurses: async (wardId: number, waitingNurseId: number, targetNurseId: number) =>
        (await client.post<void>(`/wards/${wardId}/waiting-nurses/${waitingNurseId}/connect?targetNurseId=${targetNurseId}`)).data,
    approveWatingNurses: async (wardId: number, waitingNurseId: number, shiftTeamId: number) =>
        (await client.post<void>(`/wards/${wardId}/waiting-nurses/${waitingNurseId}/approve?shiftTeamId=${shiftTeamId}`)).data,
    deleteWatingNurses: async (wardId: number, nurseId: number) =>
        (await client.delete<void>(`/wards/${wardId}/waiting-nurses?nurseId=${nurseId}`)).data,
});
