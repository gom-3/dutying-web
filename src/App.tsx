import { useEffect } from 'react';
import useAuth from '@hooks/auth/useAuth';
import { Router } from '@pages/Router';

function App() {
  useAuth(true);

  const setScreenHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  useEffect(() => {
    setScreenHeight();
    window.addEventListener('resize', setScreenHeight);
    return () => window.removeEventListener('resize', setScreenHeight);
  }, []);

  return <Router />;
}

export default App;
