import axiosInstance from './client';

export type updateNurseShiftTypeRequest = {
  isPossible?: boolean;
  isPrefer?: boolean;
};

const getNurse = async (nurseId: number) =>
  (await axiosInstance.get<Nurse>(`/nurses/${nurseId}`)).data;

const updateNurse = async (
  nurseId: number,
  updatedNurse: Pick<
    Nurse,
    | 'name'
    | 'phoneNum'
    | 'gender'
    | 'isWorker'
    | 'isDutyManager'
    | 'isWardManager'
    | 'employmentDate'
    | 'workStartDate'
    | 'workEndDate'
    | 'memo'
  >
) => (await axiosInstance.patch<Nurse>(`/nurses/${nurseId}`, updatedNurse)).data;

const connectNurse = async (nurseId: number) =>
  (await axiosInstance.post(`/nurses/${nurseId}/connect`)).data;

const unConnectNurse = async (nurseId: number) =>
  (await axiosInstance.delete(`/nurses/${nurseId}/connect`)).data;

const updateNurseShiftType = async (
  nurseId: number,
  nurseShiftTypeId: number,
  change: updateNurseShiftTypeRequest
) => (await axiosInstance.patch(`/nurses/${nurseId}/shift-types/${nurseShiftTypeId}`, change)).data;

const updateNurseCarry = async (shiftNurseId: number, value: number) =>
  (
    await axiosInstance.patch<null>(`/shift-nurses/${shiftNurseId}/carried`, {
      value,
    })
  ).data;

export {
  getNurse,
  updateNurse,
  connectNurse,
  unConnectNurse,
  updateNurseShiftType,
  updateNurseCarry,
};
