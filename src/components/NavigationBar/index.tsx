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
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import NavigationBarItem from './NavigationBarItem';
import { DUTY, HOME, MEMBER, SETTING } from '@libs/constant/path';
import { renderToStaticMarkup } from 'react-dom/server';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isFold, setIsFold] = useState(false);
  const { pathname } = useLocation();

  return (
    <div
      className={`z-10 ${!isFold ? 'sticky' : 'fixed'} top-0 duration-500 ease-in-out ${
        !isFold ? '' : 'translate-x-[-8.75rem]'
      } left-0 flex h-screen w-[10.125rem] flex-col items-center border-r border-sub-4 bg-white font-apple text-base text-sub-3 hover:translate-x-0`}
    >
      <div onClick={() => setIsFold(!isFold)}>
        <FoldIcon
          className={`${
            isFold && 'scale-x-[-1]'
          } absolute right-[.875rem] top-[.8125rem] cursor-pointer duration-300`}
        />
      </div>
      <div
        onClick={() => navigate('/')}
        className="mx-auto mt-[4.625rem] flex h-[4.375rem] w-[5.75rem] cursor-pointer items-center justify-center bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8, ${encodeURIComponent(
            renderToStaticMarkup(pathname === HOME ? <FullLogo /> : <FullLogoTransparent />)
          )}')`,
        }}
      >
        &nbsp;
        {pathname === HOME && (
          <div className="absolute right-0 h-[4.5rem] w-[.4375rem] rounded-3xl bg-main-1" />
        )}
      </div>
      <NavigationBarItem
        path={MEMBER.REGIST}
        Icon={NurseIcon}
        SelectedIcon={NurseIconSelected}
        text="간호사 관리"
      />
      <NavigationBarItem
        path={DUTY.SETTING}
        Icon={NurseIcon}
        SelectedIcon={NurseIconSelected}
        text="근무 설정"
      />
      <NavigationBarItem
        path={MEMBER.REQUEST}
        Icon={RequestIcon}
        SelectedIcon={RequestIcon}
        text="휴가 신청 관리"
      />
      <NavigationBarItem
        path={DUTY.MAKE}
        Icon={DutyIcon}
        SelectedIcon={DutyIcon}
        text="근무표 만들기"
      />
      <NavigationBarItem path={SETTING} Icon={SettingIcon} SelectedIcon={SettingIcon} text="설정" />
      <div className="absolute bottom-[1.875rem] mt-[3.125rem] flex cursor-pointer flex-col items-center">
        <img
          className="h-[3.125rem] w-[3.125rem] rounded-full object-cover"
          src="https://i.namu.wiki/i/GYWTca0tsaAfzBFcTsqoCt8wB_mrCGoSIoivXhaukvxQBil3JtX-BOXyEqqJRJJA7qTb-dpjv9YGfE7izuZ00Q.webp"
          alt="user-profile"
        />
        <div className="mt-2">{'곰세마리'}님</div>
      </div>
    </div>
  );
};

export default NavigationBar;
