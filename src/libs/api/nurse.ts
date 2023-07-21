import axiosInstance from './client';

interface NursesList {
  nurses: Nurse[];
}

export type updateNurseShiftTypeRequest = {
  isPossible?: boolean;
  isPrefer?: boolean;
};

export const getNurses = async () => {
  const response: NursesList = await axiosInstance.get('/nurses');
  return response.nurses;
};

export const getNursesByWardId = async (wardId: number) =>
  (await axiosInstance.get<NursesList>('/wards/' + wardId + '/nurses')).data;

export const updateNurse = async (nurseId: number, updatedNurse: Nurse) =>
  (await axiosInstance.patch<Nurse>('/nurses/' + nurseId, updatedNurse)).data;

export const addNurseInWard = async (wardId: number) =>
  (await axiosInstance.post<Nurse>('/wards/' + wardId + '/nurses')).data;

export const deleteNurseInWard = async (nurseId: number) =>
  (await axiosInstance.delete('/nurses/' + nurseId)).data;


export const updateNurseShiftType = async (
  nurseId: number,
  nurseShiftTypeId: number,
  change: updateNurseShiftTypeRequest
) =>
  (await axiosInstance.patch('/nurses/' + nurseId + '/shift-types/' + nurseShiftTypeId, change))
    .data;
