import { FoldIcon, FullLogo, FullLogoTransparent } from '@assets/svg';
import 'index.css';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { HOME } from '@libs/constant/path';
import NavigationBarItemGroups from './NavigationBarItemGroup';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isFold, setIsFold] = useState(false);
  const { pathname } = useLocation();

  return (
    <div
      className={`z-10 ${!isFold ? 'sticky' : 'fixed'} top-0 duration-500 ease-in-out ${
        !isFold ? '' : 'translate-x-[-140px]'
      } left-0 flex h-screen w-[162px] flex-col items-center border-r border-sub-4 bg-white font-apple text-base text-sub-3 hover:translate-x-0`}
    >
      <div onClick={() => setIsFold(!isFold)}>
        <FoldIcon
          className={`${
            isFold && 'scale-x-[-1]'
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
    </div>
  );
};

export default NavigationBar;
