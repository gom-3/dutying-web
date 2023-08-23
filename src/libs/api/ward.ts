import axiosInstance from './client';
import qs from 'qs';

const getWard = async (wardId: number) => (await axiosInstance.get<Ward>(`/wards/${wardId}`)).data;

export type CreateWardDTO = Pick<Ward, 'name' | 'hospitalName'>;
const createWrad = async (accountId: number, createWardDTO: CreateWardDTO) =>
  (await axiosInstance.post<Ward>(`/wards/accounts/${accountId}`, createWardDTO)).data;

export type EditWardDTO = Pick<Ward, 'name' | 'hospitalName'>;
const editWard = async (wardId: number, ward: EditWardDTO) =>
  (await axiosInstance.patch<Ward>(`/wards/${wardId}`, ward)).data;

// 병동 근무팀 관련
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

/** GET    `/wards/${wardId}/shift-teams/${shiftTeamId}/constraint` */
const getWardConstraint = async (wardId: number, shiftTeamId: number) =>
  (
    await axiosInstance.get<WardConstraint>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/constraint`
    )
  ).data;

/** PATCH  `/wards/${wardId}/shift-teams/${shiftTeamId}/constraint` */
const updateWardConstraint = async (
  wardId: number,
  shiftTeamId: number,
  constraint: WardConstraint
) =>
  (
    await axiosInstance.patch<WardConstraint>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/constraint`,
      constraint
    )
  ).data;

/** GET    `/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty` */
const getReqShift = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.get<RequestShift>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty?${qs.stringify({ year, month })}`
    )
  ).data;

/** GET    `/wards/${wardId}/shift-teams/${shiftTeamId}/duty` */
const getShift = async (wardId: number, shiftTeamId: number, year: number, month: number) =>
  (
    await axiosInstance.get<Shift>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/duty?${qs.stringify({ year, month })}`
    )
  ).data;

// 근무 변경
/**
 * PATCH  `/wards/${wardId}/shifts/list`
 * 근무 변경
 * */
const updateShift = async (
  wardId: number,
  year: number,
  month: number,
  day: number,
  shiftNurseId: number,
  wardShiftTypeId: number | null
) =>
  (
    await axiosInstance.patch<null>(`/wards/${wardId}/shifts`, {
      shiftNurseId,
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      wardShiftTypeId,
    })
  ).data;

/**
 * PATCH  `/wards/${wardId}/shifts/list`
 * 여러 근무 변경
 * */
export type WardShiftsDTO = {
  shiftNurseId: number;
  date: string;
  wardShiftTypeId: number | null;
}[];
const updateShifts = async (wardId: number, wardShifts: WardShiftsDTO) =>
  (
    await axiosInstance.patch(`/wards/${wardId}/shifts/list`, {
      wardShifts,
    })
  ).data;

/**
 * PATCH  `/wards/${wardId}/shifts/list`
 * 신청 근무 변경
 * */
const updateReqShift = async (
  wardId: number,
  year: number,
  month: number,
  day: number,
  shiftNurseId: number,
  wardShiftTypeId: number | null
) =>
  (
    await axiosInstance.patch(`/wards/${wardId}/req-shifts`, {
      shiftNurseId,
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      wardShiftTypeId,
    })
  ).data;

const updateNurseOrder = async (
  nurseId: number,
  shiftTeamId: number,
  nextShiftTeamId: number,
  divisionNum: number,
  prevPriority: number,
  nextPriority: number
) =>
  (
    await axiosInstance.patch(`/nurses/${nurseId}/priority`, {
      shiftTeamId,
      nextShiftTeamId,
      divisionNum,
      prevPriority,
      nextPriority,
    })
  ).data;

const updateShiftTeamDivision = async (
  shiftTeamId: number,
  prevPriority: number,
  changeValue: number
) =>
  (
    await axiosInstance.patch(`/nurses/division`, {
      shiftTeamId,
      prevPriority,
      changeValue,
    })
  ).data;

export {
  getShiftTeams,
  createShiftTeam,
  buildShiftTeam,
  deleteShiftTeam,
  updateShiftTeam,
  getWardConstraint,
  updateWardConstraint,
  getWard,
  createWrad,
  editWard,
  getReqShift,
  getShift,
  updateShift,
  updateShifts,
  updateReqShift,
  updateNurseOrder,
  updateShiftTeamDivision,
};
