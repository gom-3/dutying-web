import axiosInstance from './client';

const getWard = async (wardId: number) => (await axiosInstance.get<Ward>(`/wards/${wardId}`)).data;

export type CreateWardDTO = Pick<Ward, 'name' | 'hospitalName'>;
const createWrad = async (accountId: number, createWardDTO: CreateWardDTO) =>
  (await axiosInstance.post<Ward>(`/wards/accounts/${accountId}`, createWardDTO)).data;

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

export { getWardConstraint, updateWardConstraint, getWard, createWrad, editWard };
