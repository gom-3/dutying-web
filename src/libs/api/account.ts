import axiosInstance from './client';

const getAccount = async (accountId: number) =>
  (await axiosInstance.get<Account>(`/accounts/${accountId}`)).data;

const getAccountMeWaiting = async () => (await axiosInstance.get<Ward>(`/accounts/waiting`)).data;

const editAccount = async (accountId: number) =>
  (await axiosInstance.put<Account>(`/accounts/${accountId}`)).data;

const eidtAccountStatus = async (accountId: number, status: Account['status']) =>
  (await axiosInstance.patch<Account>(`/accounts/${accountId}/status?status=${status}`)).data;

export { getAccount, getAccountMeWaiting, editAccount, eidtAccountStatus };
