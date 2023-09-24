import NavigationBar from '@components/NavigationBar';
import useAuth from '@hooks/useAuth';
import ROUTE from '@libs/constant/path';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

function MainLayout() {
  const [isFold, setIsFold] = useState(false);
  const navigate = useNavigate();
  const {
    state: { isAuth },
  } = useAuth();

  useEffect(() => {
    if (!isAuth) navigate(ROUTE.LOGIN);
  }, [isAuth]);

  return (
    <div className={`h-full w-full bg-[#FDFCFE] ${!isFold ? 'pl-[10.125rem]' : 'pl-[2.625rem]'}`}>
      <NavigationBar isFold={isFold} setIsFold={setIsFold} />
      {isAuth && <Outlet />}
    </div>
  );
}

export default MainLayout;
