import NavigationBar from '@components/NavigationBar';
import { LOGIN } from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useUserLoggedIn } from 'stores/userStore';

function MainLayout() {
  const navigate = useNavigate();
  const isLoggedIn = useUserLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) navigate(LOGIN);
  }, []);

  return (
    <div className="flex">
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
