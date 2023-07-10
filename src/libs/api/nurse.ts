import axiosInstance from './client';

interface NursesResponse {
  count: number;
  nurses: Nurse[];
}
export const getNurses = async () => {
  const response: NursesResponse = await axiosInstance.get('/nurses');
  return response.nurses;
};

export const getNursesByWardId = async (wardId: number) =>
  (await axiosInstance.get<Nurse[]>('/wards/' + wardId + '/nurses')).data;
