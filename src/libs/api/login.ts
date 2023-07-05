import axiosInstance from './client';

export const refreshToken = async () => {
  try {
    const { data } = await axiosInstance.post('/token/refresh');
    const { accessToken } = data;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    console.log(error);
  }
};
