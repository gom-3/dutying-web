import axiosInstance from './client';

export const getShiftTypes = async (wardId: number) =>
  (await axiosInstance.get<ShiftList>(`/wards/${wardId}/shift-types`)).data;

export type CreateShiftTypeRequest = Pick<
  Shift,
  'name' | 'shortName' | 'color' | 'startTime' | 'endTime' | 'isOff'
>;
export const createShiftType = async (
  wardId: number,
  createShiftTypeRequest: CreateShiftTypeRequest
) => (await axiosInstance.post<Shift>(`/wards/${wardId}/shift-types`, createShiftTypeRequest)).data;

export const deleteShiftType = async (wardId: number, shiftTypeId: number) =>
  (await axiosInstance.delete(`/wards/${wardId}/shift-types/${shiftTypeId}`)).data;

export const updateShiftType = async (
  wardId: number,
  shiftTypeId: number,
  createShiftTypeRequest: CreateShiftTypeRequest
) =>
  (
    await axiosInstance.put<Shift>(
      `/wards/${wardId}/shift-types/${shiftTypeId}`,
      createShiftTypeRequest
    )
  ).data;
