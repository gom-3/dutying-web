import { Route, Routes } from 'react-router-dom';
import MakeDutyPage from './MakeDutyPage';

export const Router = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index />
        <Route path="/duty">
          <Route path="/duty/:id" />
          <Route path="/duty/setup" />
          <Route path="/duty/make" element={<MakeDutyPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
