import NavigationBar from '@components/NavigationBar';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useAccount } from 'store';

function MainLayout() {
  const { account } = useAccount();

  useEffect(() => {
    // 임시 차단
    // if (!account) navigate(LOGIN);
  }, [account]);

  return (
    <div className="flex bg-[#FDFCFE]">
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
