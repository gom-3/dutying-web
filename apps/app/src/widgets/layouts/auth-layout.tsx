import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Outlet, useLocation, useNavigate} from 'react-router';
import useAuth from '@/features/auth';
import {getDemoSessionInfo, isDemoSessionExpired} from '@/features/auth/model/demo-session';
import {isBoardMockEnabled} from '@/shared/api';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import useInterval from '@/shared/util/useInterval';
import {DemoExpiredModal} from './demo-expired-modal';
import DemoSessionBanner from './demo-session-banner';

export const AuthLayout = () => {
    const [currentTime, setCurrentTime] = useState(() => Date.now());
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {t} = useTypedTranslation();
    const {
        state: {isAuth, isDemoExpired, accountMe, demoStartDate},
        actions: {handleLogout, setDemoExpired, startDemoSignupTransition},
    } = useAuth();
    const demoSessionInfo = getDemoSessionInfo(demoStartDate, currentTime);
    const isDemoSessionExpiredNow = isDemoSessionExpired(demoStartDate, currentTime);
    const isDemoAccount = accountMe?.status === 'DEMO' || Boolean(demoStartDate);
    const canUseBoardMockRoute = pathname === ROUTE.BOARD && isBoardMockEnabled();

    useEffect(() => {
        if (!isAuth && !canUseBoardMockRoute) {
            navigate(ROUTE.LOGIN);
        }

        /**
         * /register에서 "병동 생성" 클릭 → /register-ward로 이동
         * AuthLayout effect가 다시 실행됨
         * accountMe.status는 WARD_SELECT_PENDING(LINKED도 DEMO도 아님)
         * pathname(/register-ward)이 허용 목록 [REGISTER, ONBOARDING_WARD_CREATE]에 없음
         * → 즉시 /register로 되돌려짐
         * [ROUTE.REGISTER, ROUTE.REGISTER_WARD, ROUTE.ENTER_WARD, ROUTE.ONBOARDING_WARD_CREATE] 추가
         */
        if (accountMe && accountMe.status !== 'LINKED' && accountMe.status !== 'DEMO') {
            if (![ROUTE.REGISTER, ROUTE.REGISTER_WARD, ROUTE.ENTER_WARD, ROUTE.ONBOARDING_WARD_CREATE].includes(pathname))
                navigate(ROUTE.REGISTER);
        }
    }, [accountMe, canUseBoardMockRoute, isAuth, navigate, pathname]);

    useEffect(() => {
        setCurrentTime(Date.now());
    }, [demoStartDate]);

    useEffect(() => {
        if (!demoStartDate) {
            if (isDemoExpired) {
                setDemoExpired(false);
            }

            return;
        }

        if (isDemoSessionExpiredNow !== isDemoExpired) {
            setDemoExpired(isDemoSessionExpiredNow);
        }
    }, [demoStartDate, isDemoExpired, isDemoSessionExpiredNow, setDemoExpired]);

    useInterval(
        () => {
            if (!demoStartDate) {
                return;
            }

            setCurrentTime(Date.now());
        },
        demoStartDate ? 1000 : null,
    );

    return (
        (isAuth || canUseBoardMockRoute) && (
            <div className="flex h-full w-full flex-col">
                <Helmet
                    title={
                        isDemoExpired
                            ? '체험이 끝났어요 | Dutying'
                            : demoSessionInfo?.isActive
                              ? t('feature.auth.demoSession.documentTitle', {countdown: demoSessionInfo.countdownLabel})
                              : '듀팅 | Dutying'
                    }
                />
                <DemoExpiredModal
                    open={isDemoExpired}
                    onPrimaryAction={() => startDemoSignupTransition()}
                    onSecondaryAction={() => void handleLogout(ROUTE.ROOT)}
                />
                {isDemoAccount && !isDemoExpired ? <DemoSessionBanner sessionInfo={demoSessionInfo} /> : null}
                <div className="min-h-0 flex-1">
                    <Outlet />
                </div>
            </div>
        )
    );
};
