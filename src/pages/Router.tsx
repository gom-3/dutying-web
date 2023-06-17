import { Route, Routes } from 'react-router-dom';
import MakeDutyPage from './MakeDutyPage';
import LoginPage from './LoginPage';
import RegistMemberPage from './MemberPage/RegistMemberPage';
import NavigationBar from '@components/common/NavigationBar';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" >
        <Route index />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/members">
          <Route path="/members/regist" element={<RegistMemberPage />} />
        </Route>
        <Route path="/duty">
          <Route path="/duty/:id" />
          <Route path="/duty/setup" />
          <Route path="/duty/make" element={<MakeDutyPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
