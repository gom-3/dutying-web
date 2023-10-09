import useAuth from '@hooks/auth/useAuth';
import ROUTE from '@libs/constant/path';
import useInterval from '@libs/util/useInterval';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useNavigate } from 'react-router';

function AuthzLayout() {
  const [demoRemainTime, setDemoRemainTime] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    state: { isAuth, accountMe, demoStartDate },
    actions: { handleLogout },
  } = useAuth();

  useEffect(() => {
    if (!isAuth) {
      navigate(ROUTE.LOGIN);
    }
    if (accountMe && accountMe.status !== 'LINKED' && accountMe.status !== 'DEMO') {
      location.replace(ROUTE.REGISTER);
    }
  }, [isAuth]);

  useInterval(
    () => {
      if (demoStartDate && new Date(demoStartDate).getTime() + 3540000 - new Date().getTime() > 0) {
        setDemoRemainTime(
          `듀팅 체험중 ${Math.ceil(
            (new Date(demoStartDate).getTime() + 3540000 - new Date().getTime()) / 1000 / 60
          )}:${Math.ceil(
            ((new Date(demoStartDate).getTime() + 3540000 - new Date().getTime()) / 1000) % 60
          )}`
        );
      } else {
        handleLogout();
      }
    },
    demoStartDate ? 1000 : null
  );

  return (
    isAuth && (
      <div>
        <Helmet title={demoRemainTime || '듀팅 | Dutying'} />
        <Outlet />
      </div>
    )
  );
}

export default AuthzLayout;
