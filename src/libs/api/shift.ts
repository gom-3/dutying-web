import axiosInstance from './client';

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
