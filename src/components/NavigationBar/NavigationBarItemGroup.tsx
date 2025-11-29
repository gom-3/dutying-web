import {DutyIcon, DutyIconSelected, NurseIcon, NurseIconSelected, RequestIcon, RequestIconSelected} from '@/assets/svg';
import ROUTE from '@/libs/constant/path';
import NavigationBarItem from './NavigationBarItem';

const items = [
    {
        path: ROUTE.MAKE,
        icon: DutyIcon,
        selectedIcon: DutyIconSelected,
        text: '근무표 만들기',
    },
    {
        path: ROUTE.REQUEST,
        icon: RequestIcon,
        selectedIcon: RequestIconSelected,
        text: '신청 근무 관리',
    },
    {
        path: ROUTE.MEMBER,
        icon: NurseIcon,
        selectedIcon: NurseIconSelected,
        text: '간호사 관리',
    },
];
const NavigationBarItemGroups = () => {
    return (
        <div className="mt-12.5">
            {items.map((item) => (
                <NavigationBarItem key={item.path} path={item.path} Icon={item.icon} SelectedIcon={item.selectedIcon} text={item.text} />
            ))}
        </div>
    );
};

export default NavigationBarItemGroups;
