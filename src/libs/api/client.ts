import axios from 'axios';

const client = axios.create({
  baseURL: '?',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 처리
client.interceptors.response.use(
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

export default client;
