import { FoldIcon, FullLogo, FullLogoTransparent, MenuIcon } from '@assets/svg';
import 'index.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { HOME } from '@libs/constant/path';
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

  return (
    <div className="group">
      {isFold && (
        <div className="fixed z-10 ml-[.9375rem] mt-[.625rem] flex items-center bg-white font-apple text-[1rem] font-medium">
          <MenuIcon className="cursor-pointer" />
        </div>
      )}
      <div
        className={`z-10 ${canHover && 'group-hover:translate-x-0'} ${
          !isFold ? 'sticky' : 'fixed'
        } top-0 duration-500 ease-in-out ${
          !isFold ? '' : 'translate-x-[-10.0625rem]'
        } left-0 flex h-screen w-[10.125rem] flex-col items-center border-r border-sub-4 bg-white font-apple text-base text-sub-3`}
      >
        <div onClick={() => setIsFold(!isFold)}>
          <FoldIcon
            className={`h-[1.875rem] w-[1.875rem] ${
              isFold && 'left-[15px] scale-x-[-1]'
            } absolute right-[14px] top-[13px] cursor-pointer duration-300`}
          />
        </div>
        <div
          onClick={() => navigate('/')}
          className="mt-[4.625rem] flex h-[4.375rem] w-full cursor-pointer items-center justify-center"
        >
          {pathname === HOME ? (
            <FullLogo className="w-[5.625rem]" />
          ) : (
            <FullLogoTransparent className="w-[5.625rem]" />
          )}
          {pathname === HOME && (
            <div className="absolute right-0 h-[4.5rem] w-[.4375rem] rounded-3xl bg-main-1" />
          )}
        </div>
        <NavigationBarItemGroups />
        <div className="absolute bottom-[1.875rem] mt-[3.125rem] flex cursor-pointer flex-col items-center">
          <img
            className="h-[3.125rem] w-[3.125rem] rounded-full object-cover"
            src="https://i.namu.wiki/i/GYWTca0tsaAfzBFcTsqoCt8wB_mrCGoSIoivXhaukvxQBil3JtX-BOXyEqqJRJJA7qTb-dpjv9YGfE7izuZ00Q.webp"
            alt="user-profile"
          />
          <div className="mt-2 ">{'곰세마리'}님</div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
