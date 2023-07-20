import { useNavigate } from 'react-router';
import axiosInstance from './client';
import { LOGIN } from '@libs/constant/path';

export const useRefreshToken = async () => {
  const navigate = useNavigate();
  try {
    const { data } = await axiosInstance.post('/token/refresh');
    const { accessToken } = data;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    navigate(LOGIN);
  }
};
