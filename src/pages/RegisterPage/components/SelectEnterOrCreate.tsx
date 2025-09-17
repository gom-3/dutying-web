import { useNavigate } from 'react-router';
import { EnterWardIcon, RegisterWardIcon } from '@/assets/svg';
import useAuth from '@/hooks/auth/useAuth';
import ROUTE from '@/libs/constant/path';

function SelectEnterOrCreate() {
  const {
    state: { accountMe },
  } = useAuth();
  const naviagte = useNavigate();

  return (
    <div className="my-auto flex w-full flex-col items-center justify-center">
      <div className="absolute top-0 left-0">
        <h1 className="font-apple text-text-1 text-[2rem] font-semibold">
          {accountMe?.name}님
          <br />
          환영합니다.
        </h1>
        <p className="font-apple text-sub-2.5 mt-6 text-[1.25rem] font-medium">
          병동 입장 혹은 생성을 선택해주세요.
        </p>
      </div>
      <div className="flex w-full gap-7.5">
        <div
          className="group shadow-banner hover:bg-main-1 flex-1 cursor-pointer rounded-[.9375rem] bg-white p-[1.875rem_1.25rem_1.25rem_1.875rem]"
          onClick={() => naviagte(ROUTE.REGISTER_WARD)}
        >
          <h2 className="font-apple text-main-1 text-[1.75rem] font-bold group-hover:text-white">
            병동 생성
          </h2>
          <p className="font-apple text-main-2 group-hover:text-main-4 text-[1rem]">
            병동을 새로 생성합니다.
          </p>
          <RegisterWardIcon className="ml-auto h-12 w-12" />
        </div>
        <div
          className="group shadow-banner hover:bg-main-1 flex-1 cursor-pointer rounded-[.9375rem] bg-white p-[1.875rem_1.25rem_1.25rem_1.875rem]"
          onClick={() => naviagte(ROUTE.ENTER_WARD)}
        >
          <h2 className="font-apple text-main-1 text-[1.75rem] font-bold group-hover:text-white">
            병동 입장
          </h2>
          <p className="font-apple text-main-2 group-hover:text-main-4 text-[1rem]">
            기존에 생성되어 있는 병동에 입장합니다.
          </p>
          <EnterWardIcon className="ml-auto h-12 w-12" />
        </div>
      </div>
    </div>
  );
}

export default SelectEnterOrCreate;
