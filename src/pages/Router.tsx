import { Navigate, Route, Routes } from 'react-router-dom';
import { SHIFT, HOME, MEMBER, ROOT } from '@libs/constant/path';
import MainLayout from '@components/Layouts/MainLayout';
import HomePage from './HomePage';
import RegistMemberPage from './MemberPage/RegistMemberPage';
import RequestPage from './RequestShiftPage';
import SetShiftPage from './SetShiftPage';
import MakeShiftPage from './MakeShiftPage';

export const Router = () => {
  return (
    <Routes>
      <Route path={ROOT} element={<Navigate to={SHIFT.MAKE} />} />
      {/* <Route path={REDIRECT} element={<RedirectPage />} /> */}
      {/* 인증된 사용자가 접근할 수 없는 페이지 */}
      {/* <Route element={<NotAuthzLayout />}> */}
      {/* <Route path={LOGIN} element={<LoginPage />} /> */}
      {/* <Route path={ONBOARDING.ACCOUNT} element={<SetAccount />} /> */}
      {/* <Route path={ONBOARDING.WARD} element={<SetWard />} /> */}
      {/* </Route> */}
      {/* 인증되지 않은 사용자가 접근할 수 없는 페이지 */}
      <Route element={<MainLayout />}>
        <Route path={HOME} element={<HomePage />} />
        <Route path={MEMBER} element={<RegistMemberPage />} />
        <Route path={SHIFT.REQUEST} element={<RequestPage />} />
        <Route path={SHIFT.SETUP} element={<SetShiftPage />} />
        <Route path={SHIFT.MAKE} element={<MakeShiftPage />} />
      </Route>
    </Routes>
  );
};
