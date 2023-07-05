import axios from 'axios';
import { refreshToken } from './login';

const axiosInstance = axios.create({
  baseURL: 'https://650c3613-c7e5-47e1-a0d9-9b96530e30bf.mock.pstmn.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 처리
axiosInstance.interceptors.response.use(
  // Data가 있으면 바로 반환하고 없으면 response를 반환
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
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
        refreshToken();
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

export default axiosInstance;
