import { FoldIcon, FullLogo, FullLogoTransparent, MenuIcon } from '@assets/svg';
import 'index.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DUTY, HOME, MEMBER, SETTING } from '@libs/constant/path';
import NavigationBarItemGroups from './NavigationBarItemGroup';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isFold, setIsFold] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    setCanHover(false);
    setTimeout(() => {
      setCanHover(true);
    }, 500);
  }, [isFold]);

  // let currentTab: any;
  // if (pathname === HOME) currentTab = <FullLogo />;
  // else if (pathname === MEMBER.REGIST) currentTab = '간호사 관리';
  // else if (pathname === DUTY.SETTING) currentTab = '근무 설정';
  // else if (pathname === MEMBER.REQUEST) currentTab = '휴가 신청 관리';
  // else if (pathname === DUTY.MAKE) currentTab = '근무표 만들기';
  // else if (pathname === SETTING) currentTab = '설정';

  return (
    <div className="group">
      {isFold && (
        <div className="fixed z-10 ml-[15px] mt-[10px] flex items-center bg-white font-apple text-[16px] font-medium">
          <MenuIcon className="cursor-pointer" />
          {/* <div className=" translate-y-[2px]">{currentTab}</div> */}
        </div>
      )}
      <div
        className={`z-10 ${canHover && 'group-hover:translate-x-0'} ${
          !isFold ? 'sticky' : 'fixed'
        } top-0 duration-500 ease-in-out ${
          !isFold ? '' : 'translate-x-[-161px]'
        } left-0 flex h-screen w-[162px] flex-col items-center border-r border-sub-4 bg-white font-apple text-base text-sub-3`}
      >
        <div onClick={() => setIsFold(!isFold)}>
          <FoldIcon
            className={`${
              isFold && 'left-[15px] scale-x-[-1]'
            } absolute right-[14px] top-[13px] cursor-pointer duration-300`}
          />
        </div>
        <div
          onClick={() => navigate('/')}
          className="mt-[74px] flex h-[70px] w-full cursor-pointer items-center justify-center"
        >
          {pathname === HOME ? <FullLogo /> : <FullLogoTransparent />}
          {pathname === HOME && (
            <div className="absolute right-0 h-[72px] w-[7px] rounded-3xl bg-main-1" />
          )}
        </div>
        <NavigationBarItemGroups />
        <div className="absolute bottom-[30px] mt-[50px] flex cursor-pointer flex-col items-center">
          <img
            className="h-[50px] w-[50px] rounded-full object-cover"
            src="https://i.namu.wiki/i/GYWTca0tsaAfzBFcTsqoCt8wB_mrCGoSIoivXhaukvxQBil3JtX-BOXyEqqJRJJA7qTb-dpjv9YGfE7izuZ00Q.webp"
            alt="user-profile"
          />
          <div className="mt-2 ">{'곰세마리'}님</div>
        </div>
        d
      </div>
    </div>
  );
};

export default NavigationBar;
