import axiosInstance from './client';

const getAccountMe = async () => (await axiosInstance.get<Account>('/accounts/me')).data;

const refreshAccessToken = async () => {
  try {
    const { data } = await axiosInstance.post('/token/refresh');
    const { accessToken } = data;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    alert('인증 정보를 갱신했습니다. 작업을 다시 실행해주세요.');
  } catch (error) {
    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
    location.replace('/login');
  }
};

export { getAccountMe, refreshAccessToken };
