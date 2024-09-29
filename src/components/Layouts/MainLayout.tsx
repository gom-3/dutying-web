import { useCallback, useState } from 'react';
import { Outlet } from 'react-router';
import NavigationBar from '@components/NavigationBar';

function MainLayout() {
  const [isFold, setIsFold] = useState(false);

  const toggleFold = useCallback(() => {
    setIsFold((prev) => !prev);
  }, [isFold]);

  return (
    <div className={`size-full bg-main-bg ${!isFold ? 'pl-[10.125rem]' : 'pl-[2.625rem]'}`}>
      <NavigationBar isFold={isFold} toggleFold={toggleFold} />
      <Outlet />
    </div>
  );
}

export default MainLayout;
