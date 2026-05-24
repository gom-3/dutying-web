import {useCallback} from 'react';
import toast from 'react-hot-toast';
import useAuth from '@/features/auth';
import axiosInstance from '@/shared/api/client';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

export const REFRESH_DEMO_EXPIRED_REDIRECT_ERROR = 'refresh_demo_expired_redirect';

export default function useRefresh() {
    const {
        state: {isDemoExpired},
        actions: {handleLogout, handleLogin, startDemoSignupTransition},
    } = useAuth();
    const {t} = useTypedTranslation();
    const refresh = useCallback(async () => {
        try {
            axiosInstance.defaults.headers.common['Authorization'] = undefined;

            const accessToken = (await axiosInstance.post('/token/refresh')).data.accessToken;

            // 여기서는 "세션만 갱신"하고, 이동은 호출자(RefreshPage)가 담당한다.
            handleLogin(accessToken, null, {preserveDemoStartDate: true});

            return accessToken as string;
        } catch {
            if (isDemoExpired) {
                startDemoSignupTransition();
                throw new Error(REFRESH_DEMO_EXPIRED_REDIRECT_ERROR);
            }

            toast.error(t('feature.auth.sessionExpired'));
            await handleLogout();
            throw new Error('refresh_failed');
        }
    }, [handleLogin, handleLogout, isDemoExpired, startDemoSignupTransition, t]);

    return {refresh};
}
