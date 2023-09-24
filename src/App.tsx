import useAuth from '@hooks/useAuth';
import ROUTE from '@libs/constant/path';
import { Router } from '@pages/Router';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function App() {
  const {
    state: { accessToken, accountMe },
    actions: { handleLogin },
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (accountMe && accountMe.status !== 'LINKED') {
      navigate(ROUTE.SIGNUP);
    }
  }, [accountMe]);

  useEffect(() => {
    if (accessToken) {
      handleLogin(accessToken);
    }
  }, []);

  return <Router />;
}

export default App;
