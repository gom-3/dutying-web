import { Route, Routes } from 'react-router-dom';
import MakeDutyPage from './MakeDutyPage';
import LoginPage from './LoginPage';

export const Router = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/duty">
          <Route path="/duty/:id" />
          <Route path="/duty/setup" />
          <Route path="/duty/make" element={<MakeDutyPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
