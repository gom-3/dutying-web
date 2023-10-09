import useAuth from '@hooks/auth/useAuth';
import ROUTE from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

function NotAuthzLayout() {
  const navigate = useNavigate();
  const {
    state: { isAuth },
  } = useAuth();

  useEffect(() => {
    if (isAuth) navigate(ROUTE.ROOT);
  }, [isAuth]);

  return !isAuth && <Outlet />;
}

export default NotAuthzLayout;
