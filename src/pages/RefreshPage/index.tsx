import {useCallback, useEffect} from 'react';
import toast from 'react-hot-toast';
import {TailSpin} from 'react-loader-spinner';
import {useNavigate} from 'react-router';
import useAuth from '@/hooks/auth/useAuth';
import axiosInstance from '@/libs/api/client';
import ROUTE from '@/libs/constant/path';

function RefreshPage() {
    const {
        actions: {handleLogout, handleLogin},
    } = useAuth();
    const navigate = useNavigate();
    const refresh = useCallback(async () => {
        try {
            axiosInstance.defaults.headers.common['Authorization'] = undefined;

            const accessToken = (await axiosInstance.post('/token/refresh')).data.accessToken;

            handleLogin(accessToken, 'back');
        } catch {
            toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
            handleLogout();
            navigate(ROUTE.ROOT);
        }
    }, [handleLogin, handleLogout, navigate]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            로그인중입니다.
            <TailSpin color="#844AFF" />
        </div>
    );
}

export default RefreshPage;
