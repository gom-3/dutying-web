import NavigationBar from '@components/NavigationBar';
import { Outlet } from 'react-router';

function MainLayout() {
  return (
    <div className="flex bg-[#FDFCFE]">
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
