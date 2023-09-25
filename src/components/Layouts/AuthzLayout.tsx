import useAuth from '@hooks/useAuth';
import ROUTE from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

function AuthzLayout() {
  const navigate = useNavigate();
  const {
    state: { isAuth },
  } = useAuth();

  useEffect(() => {
    if (!isAuth) navigate(ROUTE.LOGIN);
  }, [isAuth]);

  return isAuth && <Outlet />;
}

export default AuthzLayout;
