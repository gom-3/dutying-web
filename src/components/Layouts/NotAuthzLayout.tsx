import useAuth from '@hooks/useAuth';
import ROUTE from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

function NotAuthzLayout() {
  const navigate = useNavigate();
  const {
    state: { isAuth },
  } = useAuth();

  useEffect(() => {
    if (isAuth) navigate(ROUTE.HOME);
  }, [isAuth]);

  return <Outlet />;
}

export default NotAuthzLayout;
