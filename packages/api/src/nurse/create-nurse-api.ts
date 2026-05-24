import type {IApiClient} from '../client';
import type {INurseAPI, TCreateNurseDTO, TNurseResponse, TUpdateNurseDTO, TUpdateNurseShiftTypeRequest} from './contracts';

export const createNurseApi = (client: IApiClient): INurseAPI => ({
    createAccountNurse: async (accountId: number, createNurse: TCreateNurseDTO) =>
        (
            await client.post<TNurseResponse>(`/nurses?accountId=${accountId}`, {
                ...createNurse,
                phoneNum: createNurse.phoneNum.replace(/-+/g, ''),
                employmentDate: createNurse.employmentDate.replace(/-+/g, ''),
            })
        ).data,
    getNurse: async (nurseId: number) => (await client.get<TNurseResponse>(`/nurses/${nurseId}`)).data,
    updateNurse: async (nurseId: number, updatedNurse: TUpdateNurseDTO) =>
        (await client.patch<TNurseResponse>(`/nurses/${nurseId}`, updatedNurse)).data,
    updateNurseStatus: async (nurseId: number, status: string) => (await client.patch<TNurseResponse>(`/nurses/${nurseId}`, {status})).data,
    connectNurse: async (nurseId: number) => (await client.post<void>(`/nurses/${nurseId}/connect`)).data,
    unConnectNurse: async (nurseId: number) => (await client.delete<void>(`/nurses/${nurseId}/connect`)).data,
    updateNurseOrder: async (
        nurseId: number,
        shiftTeamId: number,
        nextShiftTeamId: number,
        divisionNum: number,
        prevPriority: number,
        nextPriority: number,
        patchYearMonth: string,
    ) =>
        (
            await client.patch<void>(`/nurses/${nurseId}/priority`, {
                shiftTeamId,
                nextShiftTeamId,
                divisionNum,
                prevPriority,
                nextPriority,
                patchYearMonth,
            })
        ).data,
    updateShiftTeamDivision: async (shiftTeamId: number, prevPriority: number, changeValue: number, patchYearMonth: string) =>
        (
            await client.patch<void>(`/nurses/division`, {
                shiftTeamId,
                prevPriority,
                changeValue,
                patchYearMonth,
            })
        ).data,
    updateNurseShiftType: async (nurseId: number, nurseShiftTypeId: number, change: TUpdateNurseShiftTypeRequest) =>
        (await client.patch<void>(`/nurses/${nurseId}/shift-types/${nurseShiftTypeId}`, change)).data,
    updateNurseCarry: async (shiftNurseId: number, value: number) =>
        (
            await client.patch<void>(`/shift-nurses/${shiftNurseId}/carried`, {
                value,
            })
        ).data,
});
