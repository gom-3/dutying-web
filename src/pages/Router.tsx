import { Route, Routes } from 'react-router-dom';
import MainLayout from '@components/Layouts/MainLayout';
import RequestPage from './RequestShiftPage';
import MakeShiftPage from './MakeShiftPage';
import MemberPage from './MemberPage';
import ROUTE from '@libs/constant/path';
import LandingPage from './LandingPage';
import SignupPage from './SignupPage';
import { NotAuthzLayout } from '@components/Layouts';
import LoginPage from './LoginPage';
import RedirectPage from './LoginPage/RedirectPage';
import AuthzLayout from '@components/Layouts/AuthzLayout';

export const Router = () => {
  return (
    <Routes>
      <Route path={ROUTE.ROOT} element={<LandingPage />} />
      {/* 인증된 사용자가 접근할 수 없는 페이지 */}
      <Route element={<NotAuthzLayout />}>
        <Route path={ROUTE.REDIRECT} element={<RedirectPage />} />
        <Route path={ROUTE.LOGIN} element={<LoginPage />} />
      </Route>
      {/* 인증되지 않은 사용자가 접근할 수 없는 페이지 */}
      <Route element={<AuthzLayout />}>
        <Route path={ROUTE.SIGNUP} element={<SignupPage />} />
        <Route element={<MainLayout />}>
          <Route path={ROUTE.MAKE} element={<MakeShiftPage />} />
          <Route path={ROUTE.REQUEST} element={<RequestPage />} />
          <Route path={ROUTE.MEMBER} element={<MemberPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
