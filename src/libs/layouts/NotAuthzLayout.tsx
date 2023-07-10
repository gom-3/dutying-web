import { HOME } from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAccount } from 'store';

function NotAuthzLayout() {
  const navigate = useNavigate();
  const { account } = useAccount();

  useEffect(() => {
    if (account) navigate(HOME);
  }, [account]);

  return <Outlet />;
}

export default NotAuthzLayout;
