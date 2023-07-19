import axiosInstance from './client';
import qs from 'qs';

export const getShiftTypes = async (wardId: number) =>
  (await axiosInstance.get<ShiftType[]>(`/wards/${wardId}/shift-types`)).data;

export type CreateShiftTypeRequest = Pick<
  ShiftType,
  'name' | 'shortName' | 'color' | 'startTime' | 'endTime' | 'isOff'
>;
export const createShiftType = async (
  wardId: number,
  createShiftTypeRequest: CreateShiftTypeRequest
) =>
  (await axiosInstance.post<ShiftType>(`/wards/${wardId}/shift-types`, createShiftTypeRequest))
    .data;

export const deleteShiftType = async (wardId: number, shiftTypeId: number) =>
  (await axiosInstance.delete(`/wards/${wardId}/shift-types/${shiftTypeId}`)).data;

export const updateShiftType = async (
  wardId: number,
  shiftTypeId: number,
  createShiftTypeRequest: CreateShiftTypeRequest
) =>
  (
    await axiosInstance.put<ShiftType>(
      `/wards/${wardId}/shift-types/${shiftTypeId}`,
      createShiftTypeRequest
    )
  ).data;

export const getWardShift = async (wardId: number, year: number, month: number) =>
  (await axiosInstance.get<Shift>(`/wards/${wardId}/duty?${qs.stringify({ year, month })}`)).data;

export const updateWardShift = async (
  year: number,
  month: number,
  day: number,
  nurseId: number,
  shiftTypeId: number | null
) =>
  (
    await axiosInstance.patch<null>(`/shifts?${qs.stringify({ nurseId, year, month, day })}`, {
      shiftTypeId,
    })
  ).data;
