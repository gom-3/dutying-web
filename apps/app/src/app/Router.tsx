import {Suspense, lazy} from 'react';
import {Route, Routes} from 'react-router-dom';
import ROUTE from '@/shared/constant/path.ts';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import PageState from '@/shared/ui/PageState';
import {AuthLayout, MainLayout, NotAuthLayout} from '@/widgets/layouts';

const LandingPage = lazy(() => import('@/pages/landing'));
const RefreshPage = lazy(() => import('@/pages/refresh'));
const RedirectPage = lazy(() => import('@/pages/login/redirect-page.tsx'));
const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const EnterWard = lazy(() => import('@/pages/register/enter-ward-page.tsx'));
const RegisterWard = lazy(() => import('@/pages/register/register-ward-page.tsx'));
const OnboardingWardCreatePage = lazy(() => import('@/pages/onboarding-ward-create'));
const MakeShiftPage = lazy(() => import('@/pages/make-shift'));
const DutyPage = lazy(() => import('@/pages/duty'));
const RequestShiftPage = lazy(() => import('@/pages/request-shift'));
const MemberPage = lazy(() => import('@/pages/member'));
const WardSettingsPage = lazy(() => import('@/pages/ward-settings'));
const ProfilePage = lazy(() => import('@/pages/profile'));

export const Router = () => {
    const {t} = useTypedTranslation();

    return (
        <Suspense
            fallback={
                <PageState
                    tone="loading"
                    layout="screen"
                    title={t('page.state.loadingTitle')}
                    description={t('page.state.loadingDescription')}
                />
            }
        >
            <Routes>
                <Route path={ROUTE.ROOT} element={<LandingPage />} />
                <Route path={ROUTE.REFRESH} element={<RefreshPage />} />
                {/* 인증된 사용자가 접근할 수 없는 페이지 */}
                <Route element={<NotAuthLayout />}>
                    <Route path={ROUTE.REDIRECT} element={<RedirectPage />} />
                    <Route path={ROUTE.LOGIN} element={<LoginPage />} />
                </Route>
                {/* 인증되지 않은 사용자가 접근할 수 없는 페이지 */}
                <Route element={<AuthLayout />}>
                    <Route path={ROUTE.REGISTER} element={<RegisterPage />} />
                    <Route path={ROUTE.ENTER_WARD} element={<EnterWard />} />
                    <Route path={ROUTE.REGISTER_WARD} element={<RegisterWard />} />
                    <Route path={ROUTE.ONBOARDING_WARD_CREATE} element={<OnboardingWardCreatePage />} />
                    <Route element={<MainLayout />}>
                        <Route path={ROUTE.MAKE} element={<MakeShiftPage />} />
                        <Route path={ROUTE.DUTY} element={<DutyPage />} />
                        <Route path={ROUTE.REQUEST} element={<RequestShiftPage />} />
                        <Route path={ROUTE.MEMBER} element={<MemberPage />} />
                        <Route path={ROUTE.WARD_SETTINGS} element={<WardSettingsPage />} />
                        <Route path={ROUTE.PROFILE} element={<ProfilePage />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};
