import 'index.css';
import NavigationBarItem from './NavigationBarItem';
import { SHIFT, MEMBER, HOME } from '@libs/constant/path';
import {
  DutyIcon,
  DutyIconSelected,
  HomeIcon,
  HomeIconSelected,
  InjectorIcon,
  InjectorIconSelected,
  NurseIcon,
  NurseIconSelected,
  RequestIcon,
  RequestIconSelected,
} from '@assets/svg';

const items = [
  {
    path: HOME,
    icon: HomeIcon,
    selectedIcon: HomeIconSelected,
    text: '홈',
  },
  {
    path: SHIFT.MAKE,
    icon: DutyIcon,
    selectedIcon: DutyIconSelected,
    text: '근무표 만들기',
  },
  {
    path: SHIFT.REQUEST,
    icon: RequestIcon,
    selectedIcon: RequestIconSelected,
    text: '휴가 신청 관리',
  },
  {
    path: MEMBER,
    icon: NurseIcon,
    selectedIcon: NurseIconSelected,
    text: '간호사 관리',
  },
  {
    path: SHIFT.SETUP,
    icon: InjectorIcon,
    selectedIcon: InjectorIconSelected,
    text: '근무 설정',
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
