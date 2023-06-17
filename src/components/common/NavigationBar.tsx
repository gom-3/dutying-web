import {
  DutyIcon,
  FoldIcon,
  FullLogo,
  FullLogoTransparent,
  NurseIcon,
  NurseIconSelected,
  RequestIcon,
  SettingIcon,
} from '@assets/svg';
import 'index.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface Props {
  path: string;
  mt: number;
  SelectedIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
}

const NavigationBarItem = ({ path, mt, SelectedIcon, Icon, text }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isSelected = path === pathname;

  return (
    <div
      className={`mt-[${mt}px] flex w-full cursor-pointer flex-col items-center`}
      onClick={() => navigate(path)}
    >
      {isSelected ? <SelectedIcon /> : <Icon />}
      {<div className={`${isSelected && 'text-main-1'}`}>{text}</div>}
      {isSelected && <div className="absolute right-0 h-[72px] w-[7px] rounded-3xl bg-main-1" />}
    </div>
  );
};

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isFold, setIsFold] = useState(false);
  const { pathname } = useLocation();

  /** 경로들은 나중에 상수 값으로 관리할 것
   * @example
   * const MEMBER_PATH  = {
   *  REGIST: '/members/regist',
   * }
   */
  return (
    <div className="absolute left-0 flex h-screen w-[162px] flex-col items-center border-r border-sub-4 bg-white font-apple text-base text-sub-3">
      <div onClick={() => setIsFold(!isFold)}>
        {isFold ? (
          <FoldIcon className="absolute right-[14px] top-[13px] cursor-pointer" />
        ) : (
          <FoldIcon className="absolute right-[14px] top-[13px] cursor-pointer" />
        )}
      </div>
      <div
        onClick={() => navigate('/')}
        className="mt-[74px] flex h-[70px] w-full cursor-pointer items-center justify-center"
      >
        {pathname === '/' ? <FullLogo /> : <FullLogoTransparent />}
        {pathname === '/' && (
          <div className="absolute right-0 h-[72px] w-[7px] rounded-3xl bg-main-1" />
        )}
      </div>
      <NavigationBarItem
        path="/members/regist"
        Icon={NurseIcon}
        SelectedIcon={NurseIconSelected}
        text="간호사 관리"
        mt={34}
      />
      <NavigationBarItem
        path="/duty/settings"
        Icon={NurseIcon}
        SelectedIcon={NurseIconSelected}
        text="근무 설정"
        mt={50}
      />
      <NavigationBarItem
        path="/members/request"
        Icon={RequestIcon}
        SelectedIcon={RequestIcon}
        text="휴가 신청 관리"
        mt={50}
      />
      <NavigationBarItem
        path="/duty/make"
        Icon={DutyIcon}
        SelectedIcon={DutyIcon}
        text="휴가 신청 관리"
        mt={50}
      />
      <NavigationBarItem
        path="/settings"
        Icon={SettingIcon}
        SelectedIcon={SettingIcon}
        text="설정"
        mt={50}
      />
      <div className="absolute bottom-[30px] mt-[50px] flex cursor-pointer flex-col items-center">
        <img
          className="h-[50px] w-[50px] rounded-full object-cover"
          src="https://i.namu.wiki/i/GYWTca0tsaAfzBFcTsqoCt8wB_mrCGoSIoivXhaukvxQBil3JtX-BOXyEqqJRJJA7qTb-dpjv9YGfE7izuZ00Q.webp"
          alt="user-profile"
        />
        <div className="mt-2 ">{'곰세마리'}님</div>
      </div>
    </div>
  );
};

export default NavigationBar;
