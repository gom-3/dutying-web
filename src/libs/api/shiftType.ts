import axiosInstance from './client';

const getShiftTypes = async (wardId: number) => (await axiosInstance.get<WardShiftType[]>(`/wards/${wardId}/shift-types`)).data;

export type CreateShiftTypeDTO = Pick<
  WardShiftType,
  'name' | 'shortName' | 'color' | 'startTime' | 'endTime' | 'isOff' | 'isDefault' | 'isCounted' | 'classification'
>;
const createShiftType = async (wardId: number, createShiftTypeDTO: CreateShiftTypeDTO) =>
  (await axiosInstance.post<WardShiftType>(`/wards/${wardId}/shift-types`, createShiftTypeDTO)).data;

const deleteShiftType = async (wardId: number, shiftTypeId: number) => (await axiosInstance.delete(`/wards/${wardId}/shift-types/${shiftTypeId}`)).data;

const updateShiftType = async (wardId: number, shiftTypeId: number, createShiftTypeDTO: CreateShiftTypeDTO) =>
  (await axiosInstance.put<WardShiftType>(`/wards/${wardId}/shift-types/${shiftTypeId}`, createShiftTypeDTO)).data;

export { getShiftTypes, createShiftType, deleteShiftType, updateShiftType };
