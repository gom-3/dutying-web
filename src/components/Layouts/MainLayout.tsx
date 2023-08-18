import NavigationBar from '@components/NavigationBar';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import useGlobalStore from 'store';

function MainLayout() {
  const { nurseId } = useGlobalStore();

  useEffect(() => {
    // 임시 차단
    // if (!account) navigate(LOGIN);
  }, [nurseId]);

  return (
    <div className="flex bg-[#FDFCFE]">
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
