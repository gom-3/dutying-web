import axiosInstance from './client';

const getAccount = async (accountId: number) =>
  (await axiosInstance.get<Account>(`/accounts/${accountId}`)).data;

const editAccount = async (accountId: number) =>
  (await axiosInstance.put<Account>(`/accounts/${accountId}`)).data;

const eidtAccountStatus = async (accountId: number) =>
  (await axiosInstance.patch<Account>(`/accounts/${accountId}/status`)).data;

export { getAccount, editAccount, eidtAccountStatus };
