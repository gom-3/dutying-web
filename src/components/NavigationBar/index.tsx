import { FoldIcon } from '@assets/svg';
import { useState, useEffect } from 'react';
import NavigationBarItemGroups from './NavigationBarItemGroup';
import { event, sendEvent } from 'analytics';
import useAuth from '@hooks/auth/useAuth';

interface Props {
  isFold: boolean;
  setIsFold: (isFold: boolean) => void;
}

const NavigationBar = ({ isFold, setIsFold }: Props) => {
  const {
    state: { accountMe },
  } = useAuth();
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(false);
    setTimeout(() => {
      setCanHover(true);
    }, 500);
  }, [isFold]);

  return (
    <div className="group fixed left-0 z-[1000]">
      <div
        className={`z-10 ${canHover && 'group-hover:translate-x-0'} ${
          !isFold ? 'sticky' : 'fixed'
        } top-0 duration-500 ease-out ${
          !isFold ? '' : 'translate-x-[-8rem]'
        } left-0 flex h-screen w-[10.125rem] flex-col items-center border-r border-sub-4 bg-white font-apple text-base text-sub-3`}
      >
        <div
          onClick={() => {
            setIsFold(!isFold);
            sendEvent(isFold ? event.spread_navigation : event.fold_navigation);
          }}
        >
          <FoldIcon
            className={`${
              isFold && 'left-[.9375rem] scale-x-[-1]'
            } absolute right-[.875rem] top-[.8125rem] h-[1.875rem] w-[1.875rem] cursor-pointer duration-300`}
          />
        </div>
        <NavigationBarItemGroups />
        <div className="absolute bottom-[1.875rem] mt-[3.125rem] flex cursor-pointer flex-col items-center">
          <div className="mt-2 ">{accountMe?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
