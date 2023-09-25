import NavigationBar from '@components/NavigationBar';
import { useState } from 'react';
import { Outlet } from 'react-router';

function MainLayout() {
  const [isFold, setIsFold] = useState(false);

  return (
    <div className={`h-full w-full bg-[#FDFCFE] ${!isFold ? 'pl-[10.125rem]' : 'pl-[2.625rem]'}`}>
      <NavigationBar isFold={isFold} setIsFold={setIsFold} />
      <Outlet />
    </div>
  );
}

export default MainLayout;
