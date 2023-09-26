import useAuth from '@hooks/auth/useAuth';
import ROUTE from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

function AuthzLayout() {
  const navigate = useNavigate();
  const {
    state: { isAuth, accountMe },
  } = useAuth();

  useEffect(() => {
    if (!isAuth) navigate(ROUTE.LOGIN);
    if (accountMe && accountMe.status !== 'LINKED') {
      location.replace(ROUTE.SIGNUP);
    }
  }, [isAuth]);

  return isAuth && <Outlet />;
}

export default AuthzLayout;
