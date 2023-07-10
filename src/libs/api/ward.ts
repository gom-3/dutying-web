import axiosInstance from './client';

export type WardResponse = Ward & ShiftList;
export const getWard = async (wardId: number) =>
  await axiosInstance.get<WardResponse>('/wards/' + wardId);

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

export type EditWardRequest = Pick<
  Ward,
  | 'name'
  | 'hospitalName'
  | 'levelDivision'
  | 'maxContinuousWork'
  | 'maxContinuousNight'
  | 'minNightInterval'
>;
export const editWrad = async (wardId: number, editWardDTO: EditWardRequest) =>
  (await axiosInstance.patch<WardResponse>(`/wards/${wardId}`, editWardDTO)).data;
