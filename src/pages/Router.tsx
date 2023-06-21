import { Route, Routes } from 'react-router-dom';
import MakeDutyPage from './MakeDutyPage';
import LoginPage from './LoginPage';
import RegistMemberPage from './MemberPage/RegistMemberPage';
import { DUTY, HOME, LOGIN, MEMBER } from '@libs/constant/path';
import SetupDutyPage from './SetupDutyPage';

export const Router = () => {
  return (
    <Routes>
      <Route path={HOME}>
        <Route index />
        <Route path={LOGIN} element={<LoginPage />} />
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
