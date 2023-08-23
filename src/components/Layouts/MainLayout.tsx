import NavigationBar from '@components/NavigationBar';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import useGlobalStore from 'store';

function MainLayout() {
  const [isFold, setIsFold] = useState(false);
  const { nurseId } = useGlobalStore();

  useEffect(() => {
    // 임시 차단
    // if (!account) navigate(LOGIN);
  }, [nurseId]);

  return (
    <div className={`h-full w-full bg-[#FDFCFE] ${!isFold ? 'pl-[10.125rem]' : 'pl-[2.625rem]'}`}>
      <NavigationBar isFold={isFold} setIsFold={setIsFold} />
      <Outlet />
    </div>
  );
}

export default MainLayout;
