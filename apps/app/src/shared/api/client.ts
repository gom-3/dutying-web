import axios from 'axios';
import {toast} from 'react-hot-toast';
import {match} from 'ts-pattern';
import ROUTE from '@/shared/constant/path';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },

    withCredentials: true,
});

// 응답 인터셉터 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    // 에러가 발생하면 각 에러에 대한 처리
    (error) => {
        const status: number | undefined = error?.response?.status;
        const message: string | undefined = error?.response?.data?.message;

        match(status)
            .with(401, () => {
                if (window.location.pathname !== ROUTE.REFRESH) {
                    const next = `${window.location.pathname}${window.location.search}`;

                    location.replace(`${ROUTE.REFRESH}?next=${encodeURIComponent(next)}`);
                }
            })
            .with(400, 404, () => {
                toast.error(message ?? '문제가 생겼어요. 다시 시도해 주세요.');
            })
            .otherwise(() => {
                // no-op
            });

        const apiError = new Error(message ?? '알 수 없는 오류가 발생했어요.') as Error & {
            code: number;
            originalError: unknown;
        };

        apiError.code = status ?? -1;
        apiError.originalError = error;

        return Promise.reject(apiError);
    },
);

export const setAccessToken = (token: string) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return;
    }

    delete axiosInstance.defaults.headers.common['Authorization'];
};

export default axiosInstance;
