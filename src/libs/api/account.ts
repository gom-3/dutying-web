import axiosInstance from './client';

export const getAccountMe = async () => (await axiosInstance.get<Account>('/account/me')).data;

export type EditAccountRequest = Pick<
  Account,
  'name' | 'gender' | 'phoneNum' | 'employmentDate' | 'isWorker' | 'birthday'
>;
export const editAccountMe = async (editAccountDTO: EditAccountRequest) =>
  (await axiosInstance.patch<Account>('/account/me', editAccountDTO)).data;
