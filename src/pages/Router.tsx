import { Route, Routes, useNavigate } from 'react-router-dom';
import MakeDutyPage from './MakeDutyPage';
import LoginPage from './LoginPage';
import RegistMemberPage from './MemberPage/RegistMemberPage';
import { DUTY, HOME, LOGIN, MEMBER, REDIRECT } from '@libs/constant/path';
import SetupDutyPage from './SetupDutyPage';
import HomePage from './HomePage';
import MainLayout from '@components/MainLayout/indes';
import { useUserLoggedIn } from 'stores/userStore';
import RedirectPage from './LoginPage/RedirectPage';

export const Router = () => {
  
  return (
    <Routes>
      <Route path={LOGIN} element={<LoginPage />} />
      <Route path={REDIRECT} element={<RedirectPage />} />
      <Route path={HOME} element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={MEMBER.ROOT}>
          <Route path={MEMBER.REGIST} element={<RegistMemberPage />} />
        </Route>
        <Route path={DUTY.ROOT}>
          <Route path={DUTY.ID} />
          <Route path={DUTY.SETTING} element={<SetupDutyPage />} />
          <Route path={DUTY.MAKE} element={<MakeDutyPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
