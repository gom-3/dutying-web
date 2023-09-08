import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '@components/Layouts/MainLayout';
import RequestPage from './RequestShiftPage';
import MakeShiftPage from './MakeShiftPage';
import MemberPage from './MemberPage';
import ROUTE from '@libs/constant/path';

export const Router = () => {
  return (
    <Routes>
      <Route path={ROUTE.ROOT} element={<Navigate to={ROUTE.MAKE} />} />
      {/* <Route path={REDIRECT} element={<RedirectPage />} /> */}
      {/* 인증된 사용자가 접근할 수 없는 페이지 */}
      {/* <Route element={<NotAuthzLayout />}> */}
      {/* <Route path={LOGIN} element={<LoginPage />} /> */}
      {/* <Route path={ONBOARDING.ACCOUNT} element={<SetAccount />} /> */}
      {/* <Route path={ONBOARDING.WARD} element={<SetWard />} /> */}
      {/* </Route> */}
      {/* 인증되지 않은 사용자가 접근할 수 없는 페이지 */}
      <Route element={<MainLayout />}>
        <Route path={ROUTE.MAKE} element={<MakeShiftPage />} />
        <Route path={ROUTE.REQUEST} element={<RequestPage />} />
        <Route path={ROUTE.MEMBER} element={<MemberPage />} />
      </Route>
    </Routes>
  );
};
