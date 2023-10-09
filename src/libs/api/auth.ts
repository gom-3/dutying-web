import axiosInstance from './client';

const getAccountMe = async () => (await axiosInstance.get<Account>('/accounts/me')).data;

const refreshAccessToken = async () => {
  try {
    const { data } = await axiosInstance.post('/token/refresh');
    const { accessToken } = data;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    console.log('로그인이 만료되었습니다. 다시 로그인해주세요.');
    location.replace('/login');
  }
};

const demoStart = () => async () =>
  (
    await axiosInstance.post<{ wardResDto: Ward; accountResDto: Account; accessToken: string }>(
      '/demo/start'
    )
  ).data;

export { getAccountMe, refreshAccessToken, demoStart };
