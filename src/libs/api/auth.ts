import axiosInstance from './client';

const getAccountMe = async () => (await axiosInstance.get<Account>('/accounts/me')).data;
const demoStart = () => async () =>
  (
    await axiosInstance.post<{ wardResDto: Ward; accountResDto: Account; accessToken: string }>(
      '/demo/start'
    )
  ).data;
const logout = async (accessToken: string | null) =>
  (await axiosInstance.post('/token/blacklist', { accessToken })).data;

export { getAccountMe, demoStart, logout };
