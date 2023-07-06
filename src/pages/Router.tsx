import { Route, Routes } from 'react-router-dom';
import MakeDutyPage from './MakeDutyPage';
import LoginPage from './LoginPage';
import RegistMemberPage from './MemberPage/RegistMemberPage';
import { DUTY, HOME, LOGIN, MEMBER, ONBOARDING } from '@libs/constant/path';
import SetupDutyPage from './SetupDutyPage';
import HomePage from './HomePage';
import MainLayout from '@components/MainLayout/indes';
import OnboardingPage from './OnboardingPage';
import RequestPage from './RequestPage';

export const Router = () => {
  return (
    <Routes>
      <Route path={HOME} element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={LOGIN} element={<LoginPage />} />
        <Route path={MEMBER.ROOT}>
          <Route path={MEMBER.REGIST} element={<RegistMemberPage />} />
          <Route path={MEMBER.REQUEST} element={<RequestPage />} />
        </Route>
        <Route path={DUTY.ROOT}>
          <Route path={DUTY.ID} />
          <Route path={DUTY.SETTING} element={<DutySetupPage />} />
          <Route path={DUTY.MAKE} element={<MakeDutyPage />} />
        </Route>
      </Route>
      <Route path={ONBOARDING} element={<OnboardingPage />} />
    </Routes>
  );
};
