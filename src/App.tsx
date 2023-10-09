import useAuth from '@hooks/auth/useAuth';
import { Router } from '@pages/Router';
import { useEffect } from 'react';

function App() {
  const {
    state: { accessToken },
    actions: { handleLogin },
  } = useAuth();

  useEffect(() => {
    if (accessToken) {
      handleLogin(accessToken);
    }
  }, []);

  return <Router />;
}

export default App;
