import {useState} from 'react';
import {Outlet} from 'react-router';
import NavigationBar from '@/components/NavigationBar';

function MainLayout() {
    const [isFold, setIsFold] = useState(false);

    return (
        <div className={`h-full w-full bg-[#FDFCFE] ${!isFold ? 'pl-40.5' : 'pl-10.5'}`}>
            <NavigationBar isFold={isFold} setIsFold={setIsFold} />
            <Outlet />
        </div>
    );
}

export default MainLayout;
