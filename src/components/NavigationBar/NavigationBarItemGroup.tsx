import NavigationBarItem from './NavigationBarItem';
import ROUTE from '@libs/constant/path';
import {
  DutyIcon,
  DutyIconSelected,
  // HomeIcon,
  // HomeIconSelected,
  NurseIcon,
  NurseIconSelected,
  RequestIcon,
  RequestIconSelected,
} from '@assets/svg';

const items = [
  // {
  //   path: HOME,
  //   icon: HomeIcon,
  //   selectedIcon: HomeIconSelected,
  //   text: '홈',
  // },
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
    <div className="mt-[3.125rem]">
      {items.map((item) => (
        <NavigationBarItem
          key={item.path}
          path={item.path}
          Icon={item.icon}
          SelectedIcon={item.selectedIcon}
          text={item.text}
        />
      ))}
    </div>
  );
};

export default NavigationBarItemGroups;
