import {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router';
import useAuth from '@/features/auth';
import ROUTE from '@/shared/constant/path';

export const NotAuthLayout = () => {
    const navigate = useNavigate();
    const {
        state: {isAuth},
    } = useAuth();

    useEffect(() => {
        if (isAuth) navigate(ROUTE.MAKE);
    }, [isAuth, navigate]);

    return !isAuth && <Outlet />;
};
