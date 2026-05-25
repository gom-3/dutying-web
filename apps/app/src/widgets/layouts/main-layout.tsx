import {Outlet} from 'react-router';
import NavigationBar from '@/widgets/navigation-bar';
import WardChatWidget from '@/widgets/ward-chat';

export const MainLayout = () => {
    return (
        <div className="flex h-full w-full bg-[#FDFCFE]">
            <NavigationBar />
            <main className="min-w-0 flex-1 overflow-x-auto">
                <Outlet />
            </main>
            <WardChatWidget />
        </div>
    );
};
