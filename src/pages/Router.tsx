import { Route, Routes } from 'react-router-dom';
import { AuthzLayout, NotAuthzLayout, MainLayout } from '@components/Layouts';
import ROUTE from '@libs/constant/path';
import { Suspense, lazy } from 'react';

const LandingPage = lazy(() => import('./LandingPage'));
const RefreshPage = lazy(() => import('./RefreshPage'));
const RedirectPage = lazy(() => import('./LoginPage/RedirectPage.tsx'));
const LoginPage = lazy(() => import('./LoginPage'));
const RegisterPage = lazy(() => import('./RegisterPage'));
const EnterWard = lazy(() => import('./RegisterPage/EnterWard'));
const RegisterWard = lazy(() => import('./RegisterPage/RegisterWard'));
const MakeShiftPage = lazy(() => import('./MakeShiftPage'));
const RequestShiftPage = lazy(() => import('./RequestShiftPage'));
const MemberPage = lazy(() => import('./MemberPage'));
const ProfilePage = lazy(() => import('./ProfilePage'));

export const Router = () => {
  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path={ROUTE.ROOT} element={<LandingPage />} />
        <Route path={ROUTE.REFRESH} element={<RefreshPage />} />
        {/* 인증된 사용자가 접근할 수 없는 페이지 */}
        <Route element={<NotAuthzLayout />}>
          <Route path={ROUTE.REDIRECT} element={<RedirectPage />} />
          <Route path={ROUTE.LOGIN} element={<LoginPage />} />
        </Route>
        {/* 인증되지 않은 사용자가 접근할 수 없는 페이지 */}
        <Route element={<AuthzLayout />}>
          <Route path={ROUTE.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTE.ENTER_WARD} element={<EnterWard />} />
          <Route path={ROUTE.REGISTER_WARD} element={<RegisterWard />} />
          <Route element={<MainLayout />}>
            <Route path={ROUTE.MAKE} element={<MakeShiftPage />} />
            <Route path={ROUTE.REQUEST} element={<RequestShiftPage />} />
            <Route path={ROUTE.MEMBER} element={<MemberPage />} />
            <Route path={ROUTE.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};
