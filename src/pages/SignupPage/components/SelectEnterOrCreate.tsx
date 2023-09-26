import { EnterWardIcon, RegisterWardIcon } from '@assets/svg';
import useAuth from '@hooks/auth/useAuth';
import { useState } from 'react';

function SelectEnterOrCreate() {
  const {
    state: { accountMe },
  } = useAuth();
  const [willEnter] = useState(true);

  return (
    <div className="my-auto flex w-full flex-col items-center justify-center">
      <div className="absolute left-0 top-0">
        <h1 className="font-apple text-[2rem] font-semibold text-text-1">
          {accountMe?.name}님
          <br />
          환영합니다.
        </h1>
        <p className="mt-[1.5rem] font-apple text-[1.25rem] font-medium text-sub-2.5">
          병동 입장 혹은 생성을 선택해주세요.
        </p>
      </div>
      <div className="flex w-full gap-[1.875rem]">
        <div
          className={`flex-1 cursor-pointer rounded-[.9375rem] p-[1.875rem_1.25rem_1.25rem_1.875rem] shadow-banner ${
            willEnter ? 'bg-main-1' : 'bg-white'
          }`}
        >
          <h2
            className={`font-apple text-[1.75rem] font-bold ${
              willEnter ? 'text-white' : 'text-main-1'
            }
          `}
          >
            병동 입장
          </h2>
          <p className={`font-apple text-[1rem] ${willEnter ? 'text-main-4' : 'text-main-2'}`}>
            기존에 생성되어 있는 병동에 입장합니다.
          </p>
          <EnterWardIcon className="ml-auto h-[3rem] w-[3rem]" />
        </div>
        <div
          className={`flex-1 cursor-pointer rounded-[.9375rem] p-[1.875rem_1.25rem_1.25rem_1.875rem] shadow-banner ${
            !willEnter ? 'bg-main-1' : 'bg-white'
          }`}
        >
          <h2
            className={`font-apple text-[1.75rem] font-bold ${
              !willEnter ? 'text-white' : 'text-main-1'
            }
          `}
          >
            병동 생성
          </h2>
          <p className={`font-apple text-[1rem] ${!willEnter ? 'text-main-4' : 'text-main-2'}`}>
            병동을 새로 생성합니다.
          </p>
          <RegisterWardIcon className="ml-auto h-[3rem] w-[3rem]" />
        </div>
      </div>
    </div>
  );
}

export default SelectEnterOrCreate;
