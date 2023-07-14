import 'index.css';
import NavigationBarItem from './NavigationBarItem';
import { SHIFT, MEMBER } from '@libs/constant/path';
import {
  DutyIcon,
  DutyIconSelected,
  InjectorIcon,
  InjectorIconSelected,
  NurseIcon,
  NurseIconSelected,
  RequestIcon,
  RequestIconSelected,
} from '@assets/svg';

const items = [
  {
    path: MEMBER.REGIST,
    icon: NurseIcon,
    selectedIcon: NurseIconSelected,
    text: '간호사 관리',
  },
  {
    path: SHIFT.SETTING,
    icon: InjectorIcon,
    selectedIcon: InjectorIconSelected,
    text: '근무 설정',
  },
  {
    path: MEMBER.REQUEST,
    icon: RequestIcon,
    selectedIcon: RequestIconSelected,
    text: '휴가 신청 관리',
  },
  {
    path: SHIFT.MAKE,
    icon: DutyIcon,
    selectedIcon: DutyIconSelected,
    text: '근무표 만들기',
  },
  // {
  //   path: SETTING,
  //   icon: SettingIcon,
  //   selectedIcon: SettingIconSelected,
  //   text: '설정',
  // },
];

const NavigationBarItemGroups = () => {
  return (
    <>
      {items.map((item) => (
        <NavigationBarItem
          key={item.path}
          path={item.path}
          Icon={item.icon}
          SelectedIcon={item.selectedIcon}
          text={item.text}
        />
      ))}
    </>
  );
};

export default NavigationBarItemGroups;
