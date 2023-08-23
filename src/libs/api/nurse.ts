import axiosInstance from './client';

/** GET    `/wards/${wardId}/shift-teams/${shiftTeamId}/nurses` */
const getShiftTeamNurses = async (wardId: number, shiftTeamId: number) =>
  (
    await axiosInstance.get<{ nurses: Nurse[] }>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/nurses`
    )
  ).data.nurses;

/** POST   `/wards/${wardId}/shift-teams/${shiftTeamId}/nurses` */
const addNurseIntoShiftTeam = async (
  wardId: number,
  shiftTeamId: number,
  addShiftTeamNurseDTO: UpdateNurseDTO
) =>
  (
    await axiosInstance.post<Nurse>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/nurses`,
      addShiftTeamNurseDTO
    )
  ).data;

/** DELETE `/wards/${wardId}/shift-teams/${shiftTeamId}/nurses/${nurseId}` */
const removeNurseFromShiftTeam = async (wardId: number, shiftTeamId: number, nurseId: number) =>
  (
    await axiosInstance.delete<Nurse>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/nurses${nurseId}`
    )
  ).data;

/** DELETE `/nurses/${nurseId}` */
const getNurse = async (nurseId: number) =>
  (await axiosInstance.get<Nurse>(`/nurses/${nurseId}`)).data;

export type UpdateNurseDTO = Pick<
  Nurse,
  | 'name'
  | 'phoneNum'
  | 'gender'
  | 'isWorker'
  | 'employmentDate'
  | 'isDutyManager'
  | 'isWardManager'
  | 'memo'
  | 'workStartDate'
  | 'workEndDate'
>;
const updateNurse = async (nurseId: number, updatedNurse: UpdateNurseDTO) =>
  (await axiosInstance.patch<Nurse>(`/nurses/${nurseId}`, updatedNurse)).data;

const connectNurse = async (nurseId: number) =>
  (await axiosInstance.post(`/nurses/${nurseId}/connect`)).data;

const unConnectNurse = async (nurseId: number) =>
  (await axiosInstance.delete(`/nurses/${nurseId}/connect`)).data;

export type updateNurseShiftTypeRequest = {
  isPossible?: boolean;
  isPrefer?: boolean;
};
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
  // 근무팀 간호사
  getShiftTeamNurses,
  addNurseIntoShiftTeam,
  removeNurseFromShiftTeam,
  // 간호사
  getNurse,
  updateNurse,
  connectNurse,
  unConnectNurse,
  updateNurseShiftType,
  updateNurseCarry,
};
