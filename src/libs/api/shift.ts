import axiosInstance from './client';
import qs from 'qs';

export const getShiftTypes = async (wardId: number) =>
  (await axiosInstance.get<WardShiftType[]>(`/wards/${wardId}/shift-types`)).data;

export type CreateShiftTypeDTO = Pick<
  WardShiftType,
  'name' | 'shortName' | 'color' | 'startTime' | 'endTime' | 'isOff'
>;
export const createShiftType = async (wardId: number, createShiftTypeRequest: CreateShiftTypeDTO) =>
  (await axiosInstance.post<WardShiftType>(`/wards/${wardId}/shift-types`, createShiftTypeRequest))
    .data;

export const deleteShiftType = async (wardId: number, shiftTypeId: number) =>
  (await axiosInstance.delete(`/wards/${wardId}/shift-types/${shiftTypeId}`)).data;

export const updateShiftType = async (
  wardId: number,
  shiftTypeId: number,
  updateShiftTypeequest: CreateShiftTypeDTO
) =>
  (
    await axiosInstance.put<WardShiftType>(
      `/wards/${wardId}/shift-types/${shiftTypeId}`,
      updateShiftTypeequest
    )
  ).data;

export const getShift = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.get<Shift>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/duty?${qs.stringify({ year, month })}`
    )
  ).data;

export const updateShift = async (
  wardId: number,
  year: number,
  month: number,
  day: number,
  shiftNurseId: number,
  wardShiftTypeId: number | null
) =>
  (
    await axiosInstance.patch<null>(`/wards/${wardId}/shifts`, {
      shiftNurseId,
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      wardShiftTypeId,
    })
  ).data;

export const getRequestShift = async (wardId: number, year: number, month: number) =>
  (
    await axiosInstance.get<RequestShift>(
      `/wards/${wardId}/req-duty?${qs.stringify({ year, month })}`
    )
  ).data;

export const updateRequestShift = async (
  year: number,
  month: number,
  day: number,
  nurseId: number,
  shiftTypeId: number | null
) =>
  (
    await axiosInstance.patch<null>(`/req-shifts?${qs.stringify({ nurseId, year, month, day })}`, {
      shiftTypeId,
    })
  ).data;
