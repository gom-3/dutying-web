import { Route, Routes } from 'react-router-dom';
import { SHIFT, HOME, LOGIN, MEMBER, REDIRECT, ONBOARDING, ROOT } from '@libs/constant/path';
import MakeShiftPage from './MakeShiftPage';
import LoginPage from './LoginPage';
import RegistMemberPage from './MemberPage/RegistMemberPage';
import HomePage from './HomePage';
import MainLayout from '@libs/layouts/MainLayout';
import RedirectPage from './LoginPage/RedirectPage';
import RequestPage from './RequestPage';
import SetAccount from './OnboardingPage/SetAccount';
import SetWard from './OnboardingPage/SetWard';
import LandingPage from './LandingPage';
import NotAuthzLayout from '@libs/layouts/NotAuthzLayout';
import SetShiftPage from './SetShiftPage';

export const Router = () => {
  return (
    <Routes>
      <Route path={ROOT} element={<LandingPage />} />
      <Route path={REDIRECT} element={<RedirectPage />} />
      {/* 인증된 사용자가 접근할 수 없는 페이지 */}
      <Route element={<NotAuthzLayout />}>
        <Route path={LOGIN} element={<LoginPage />} />
        <Route path={ONBOARDING.ACCOUNT} element={<SetAccount />} />
        <Route path={ONBOARDING.WARD} element={<SetWard />} />
      </Route>
      {/* 인증되지 않은 사용자가 접근할 수 없는 페이지 */}
      <Route element={<MainLayout />}>
        <Route path={HOME} element={<HomePage />} />
        <Route path={MEMBER.REGIST} element={<RegistMemberPage />} />
        <Route path={MEMBER.REQUEST} element={<RequestPage />} />
        <Route path={SHIFT.SETTING} element={<SetShiftPage />} />
        <Route path={SHIFT.MAKE} element={<MakeShiftPage />} />
      </Route>
    </Routes>
  );
};
