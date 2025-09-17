import { type Account } from '@/types/account';
import { type Ward } from '@/types/ward';
import axiosInstance from './client';

const getAccount = async (accountId: number) =>
  (await axiosInstance.get<Account>(`/accounts/${accountId}`)).data;
const getAccountMeWaiting = async () => (await axiosInstance.get<Ward>(`/accounts/waiting`)).data;

export type EditAccountDTO = {
  name: string;
  profileImgBase64: string;
};

const editAccount = async (accountId: number, editAccountDTO: EditAccountDTO) =>
  (await axiosInstance.put<Account>(`/accounts/${accountId}`, editAccountDTO)).data;
const eidtAccountStatus = async (accountId: number, status: Account['status']) =>
  (await axiosInstance.patch<Account>(`/accounts/${accountId}/status?status=${status}`)).data;
const initAccount = async (accountId: number, name: string, profileImgBase64: string) =>
  (await axiosInstance.patch<Account>(`/accounts/${accountId}/init`, { name, profileImgBase64 }))
    .data;
const deleteAccount = async (accountId: number) =>
  (await axiosInstance.delete<Account>(`/accounts/${accountId}`)).data;

export {
  getAccount,
  getAccountMeWaiting,
  editAccount,
  eidtAccountStatus,
  initAccount,
  deleteAccount,
};
