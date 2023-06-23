import 'index.css';
import NavigationBarItem from './NavigationBarItem';
import { DUTY, MEMBER, SETTING } from '@libs/constant/path';
import {
  DutyIcon,
  DutyIconSelected,
  InjectorIcon,
  InjectorIconSelected,
  NurseIcon,
  NurseIconSelected,
  RequestIcon,
  RequestIconSelected,
  SettingIcon,
  SettingIconSelected,
} from '@assets/svg';

const items = [
  {
    path: MEMBER.REGIST,
    icon: NurseIcon,
    selectedIcon: NurseIconSelected,
    text: '간호사 관리',
    mt: 34,
  },
  {
    path: DUTY.SETTING,
    icon: InjectorIcon,
    selectedIcon: InjectorIconSelected,
    text: '근무 설정',
    mt: 50,
  },
  {
    path: MEMBER.REQUEST,
    icon: RequestIcon,
    selectedIcon: RequestIconSelected,
    text: '휴가 신청 관리',
    mt: 50,
  },
  {
    path: DUTY.MAKE,
    icon: DutyIcon,
    selectedIcon: DutyIconSelected,
    text: '근무표 만들기',
    mt: 50,
  },
  {
    path: SETTING,
    icon: SettingIcon,
    selectedIcon: SettingIconSelected,
    text: '설정',
    mt: 50,
  },
];

const NavigationBarItemGroups = () => {
  return (
    <>
      {items.map((item) => (
        <NavigationBarItem
          path={item.path}
          Icon={item.icon}
          SelectedIcon={item.selectedIcon}
          text={item.text}
          mt={item.mt}
        />
      ))}
    </>
  );
};

export default NavigationBarItemGroups;
