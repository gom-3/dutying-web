import NavigationBar from '@components/NavigationBar';
import { LOGIN } from '@libs/constant/path';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAccount } from 'store';

function MainLayout() {
  const navigate = useNavigate();
  const { account } = useAccount();

  useEffect(() => {
    if (!account) navigate(LOGIN);
  }, [account]);

  return (
    <div className="flex bg-[#FDFCFE]">
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
