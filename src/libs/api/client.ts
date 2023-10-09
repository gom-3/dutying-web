import axios from 'axios';
import { refreshAccessToken } from './auth';
import { match } from 'ts-pattern';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  // 에러가 발생하면 각 에러에 대한 처리
  (error) => {
    match(error.response.status)
      .with(401, () => {
        refreshAccessToken();
      })
      .with(400, 403, 404, () => {
        toast.error('에러가 발생했습니다. 다시 시도해주세요.');
      });

    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default axiosInstance;
