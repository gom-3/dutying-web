import axios from 'axios';
import { refreshAccessToken } from './auth';

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
    if (error.response) {
      if (error.response.status === 400) {
        return {
          code: '400',
          message: '400',
        };
      }
      if (error.response.status === 401) {
        // 토큰 만료되었을 때 refreshToken으로 accessToken 재발급
        refreshAccessToken();
        return {
          code: '401',
          message: '401',
        };
      }
      if (error.response.status === 403) {
        return {
          code: '403',
          message: '403',
        };
      }
      if (error.response.status === 404) {
        return {
          code: '404',
          message: '404',
        };
      }
    }
    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default axiosInstance;
