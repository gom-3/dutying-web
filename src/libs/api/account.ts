// 계정 관련 API
// GET    /account/:id/shifts
// POST   /account/:id/shifts
// DELETE /account/:id/shifts
// PATCH  /account/:id/shifts
// POST   /account/:id/shifts/list

import axiosInstance from './client';

// PUT    /account/:id/shift-types/:id
// DELETE /account/:id/shift-types/:id
// GET    /account/:id/shift-types
// POST   /account/:id/shift-types

export const getAccount = async (accountId: number) =>
  (await axiosInstance.get<Account>(`/accounts/${accountId}`)).data;

export const editAccount = async (accountId: number) =>
  (await axiosInstance.put<Account>(`/accounts/${accountId}`)).data;

export const eidtAccountStatus = async (accountId: number) =>
  (await axiosInstance.patch<Account>(`/accounts/${accountId}/status`)).data;
