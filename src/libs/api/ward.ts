import axiosInstance from './client';

const getWard = async (wardId: number) => (await axiosInstance.get<Ward>(`/wards/${wardId}`)).data;

export type CreateWardDTO = {
  name: string;
  hospitalName: string;
  wardShiftTypes: Omit<WardShiftType, 'wardShiftTypeId'>[];
  shiftTeams: { nurseNames: string[] }[];
};
const createWrad = async (createWardDTO: CreateWardDTO) =>
  (await axiosInstance.post<Ward>(`/wards`, createWardDTO)).data;

export type EditWardDTO = Pick<Ward, 'name' | 'hospitalName'>;
const editWard = async (wardId: number, ward: EditWardDTO) =>
  (await axiosInstance.patch<Ward>(`/wards/${wardId}`, ward)).data;

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

const getWardByCode = async (code: string) =>
  (await axiosInstance.get<Ward>(`/wards/search?code=${code}`)).data;

const getWatingNurses = async (wardId: number) =>
  (await axiosInstance.get(`/wards/${wardId}/waiting-nurses`)).data;

const addMeToWatingNurses = async (wardId: number) =>
  (await axiosInstance.post(`/wards/${wardId}/waiting-nurses`)).data;

const connectWatingNurses = async (wardId: number, waitingNurseId: number) =>
  (await axiosInstance.post(`/wards/${wardId}/waiting-nurses/${waitingNurseId}/connect`)).data;

const approveWatingNurses = async (wardId: number, waitingNurseId: number) =>
  (await axiosInstance.post(`/wards/${wardId}/waiting-nurses/${waitingNurseId}/approve`)).data;

const deleteWatingNurses = async (wardId: number, nurseId: number) =>
  (await axiosInstance.delete(`/wards/${wardId}/waiting-nurses?nurseId=${nurseId}`)).data;

export {
  getWardConstraint,
  updateWardConstraint,
  getWard,
  createWrad,
  editWard,
  getWardByCode,
  getWatingNurses,
  addMeToWatingNurses,
  connectWatingNurses,
  approveWatingNurses,
  deleteWatingNurses,
};
