import axiosInstance from './client';
import qs from 'qs';

/** GET    `/wards/${wardId}/shift-teams` */
const getShiftTeams = async (wardId: number) =>
  (await axiosInstance.get<{ shiftTeams: ShiftTeam[] }>(`/wards/${wardId}/shift-teams`)).data
    .shiftTeams;

/** POST   `/wards/${wardId}/shift-teams` */
const createShiftTeam = async (wardId: number) =>
  (await axiosInstance.post<ShiftTeam>(`/wards/${wardId}/shift-teams`)).data;

/** POST   `/wards/${wardId}/shift-teams/build` */
const buildShiftTeam = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.post<ShiftTeam>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}?${qs.stringify({ year, month })}`
    )
  ).data;

/** DELETE `/wards/${wardId}/shift-teams/${shiftTeamId}` */
const deleteShiftTeam = async (wardId: number, shiftTeamId: number) =>
  (await axiosInstance.delete<ShiftTeam>(`/wards/${wardId}/shift-teams/${shiftTeamId}`)).data;

/** PATCH  `/wards/${wardId}/shift-teams/${shiftTeamId}` */
export type UpdateShiftTeamDTO = Pick<ShiftTeam, 'name'>;
const updateShiftTeam = async (
  wardId: number,
  shiftTeamId: number,
  updateShiftTeamDTO: UpdateShiftTeamDTO
) =>
  (
    await axiosInstance.patch<ShiftTeam>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}`,
      updateShiftTeamDTO
    )
  ).data;

const updateNurseOrder = async (
  nurseId: number,
  shiftTeamId: number,
  nextShiftTeamId: number,
  divisionNum: number,
  prevPriority: number,
  nextPriority: number,
  patchYearMonth: string
) =>
  (
    await axiosInstance.patch(`/nurses/${nurseId}/priority`, {
      shiftTeamId,
      nextShiftTeamId,
      divisionNum,
      prevPriority,
      nextPriority,
      patchYearMonth,
    })
  ).data;

const updateShiftTeamDivision = async (
  shiftTeamId: number,
  prevPriority: number,
  changeValue: number,
  patchYearMonth: string
) =>
  (
    await axiosInstance.patch(`/nurses/division`, {
      shiftTeamId,
      prevPriority,
      changeValue,
      patchYearMonth,
    })
  ).data;
export {
  getShiftTeams,
  createShiftTeam,
  buildShiftTeam,
  deleteShiftTeam,
  updateShiftTeam,
  updateNurseOrder,
  updateShiftTeamDivision,
};
