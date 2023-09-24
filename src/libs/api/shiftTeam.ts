import axiosInstance from './client';
import qs from 'qs';
import { UpdateNurseDTO } from './nurse';

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
      `/wards/${wardId}/shift-teams/${shiftTeamId}/nurses/${nurseId}`
    )
  ).data;

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

export {
  getShiftTeamNurses,
  addNurseIntoShiftTeam,
  removeNurseFromShiftTeam,
  getShiftTeams,
  createShiftTeam,
  buildShiftTeam,
  deleteShiftTeam,
  updateShiftTeam,
};
