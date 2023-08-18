import { HOME } from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import useGlobalStore from 'store';

function NotAuthzLayout() {
  const navigate = useNavigate();
  const { nurseId } = useGlobalStore();

  useEffect(() => {
    if (nurseId) navigate(HOME);
  }, [nurseId]);

  return <Outlet />;
}

export default NotAuthzLayout;
