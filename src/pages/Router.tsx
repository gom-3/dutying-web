import { Route, Routes } from 'react-router-dom';
import MainLayout from '@components/Layouts/MainLayout';
import MakeShiftPage from './MakeShiftPage';
import MemberPage from './MemberPage';
import ROUTE from '@libs/constant/path';
import LandingPage from './LandingPage';
import RegisterPage from './RegisterPage';
import { NotAuthzLayout } from '@components/Layouts';
import LoginPage from './LoginPage';
import RedirectPage from './LoginPage/RedirectPage';
import AuthzLayout from '@components/Layouts/AuthzLayout';
import EnterWard from './RegisterPage/EnterWard';
import RegisterWard from './RegisterPage/RegisterWard';
import RefreshPage from './RefreshPage';
import RequestShiftPage from './RequestShiftPage';

export const Router = () => {
  return (
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
        </Route>
      </Route>
    </Routes>
  );
};
