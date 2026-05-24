import {useEffect} from 'react';
import useAuth from '@/features/auth';
import ROUTE from '@/shared/constant/path';

export const getLandingRedirectPath = (isAuth: boolean) => (isAuth ? ROUTE.MAKE : ROUTE.LOGIN);

const LandingPageRedirect = () => {
    const {
        state: {isAuth, _loaded},
    } = useAuth();

    useEffect(() => {
        if (!_loaded) {
            return;
        }

        window.location.replace(getLandingRedirectPath(isAuth));
    }, [_loaded, isAuth]);

    return null;
};

export default LandingPageRedirect;
