import axiosInstance from './client';

type WardWithShiftTypes = {
  shiftTypes: ShiftType[];
};
export type WardResponse = Ward & WardWithShiftTypes;
export const getWard = async (wardId: number) =>
  (await axiosInstance.get<WardResponse>('/wards/' + wardId)).data;

export type CreateWardRequest = Partial<
  Pick<
    Ward,
    | 'name'
    | 'hospitalName'
    | 'nurseCnt'
    | 'levelDivision'
    | 'maxContinuousWork'
    | 'maxContinuousNight'
    | 'minNightInterval'
  >
>;
export const createWrad = async () => (await axiosInstance.post<WardResponse>('/wards')).data;

export type EditWardRequest = Partial<
  Pick<
    Ward,
    | 'name'
    | 'hospitalName'
    | 'levelDivision'
    | 'maxContinuousWork'
    | 'maxContinuousNight'
    | 'minNightInterval'
  >
>;
export const editWard = async (wardId: number, editWardDTO: EditWardRequest) =>
  (await axiosInstance.patch<WardResponse>(`/wards/${wardId}`, editWardDTO)).data;
