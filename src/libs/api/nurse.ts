import axiosInstance from './client';

interface NursesResponse {
  count: number;
  nurses: Nurse[];
}

export const getNurses: () => Promise<Nurse[]> = async () => {
  const response: NursesResponse = await axiosInstance.get('/nurses');
  return response.nurses;
};
