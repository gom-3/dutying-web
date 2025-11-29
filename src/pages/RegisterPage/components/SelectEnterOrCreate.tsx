import {useNavigate} from 'react-router';
import {EnterWardIcon, RegisterWardIcon} from '@/assets/svg';
import useAuth from '@/hooks/auth/useAuth';
import ROUTE from '@/libs/constant/path';

function SelectEnterOrCreate() {
    const {
        state: {accountMe},
    } = useAuth();
    const naviagte = useNavigate();

    return (
        <div className="my-auto flex w-full flex-col items-center justify-center">
            <div className="absolute top-0 left-0">
                <h1 className="font-apple text-[2rem] font-semibold text-text-1">
                    {accountMe?.name}님
                    <br />
                    환영합니다.
                </h1>
                <p className="mt-6 font-apple text-[1.25rem] font-medium text-sub-2.5">병동 입장 혹은 생성을 선택해주세요.</p>
            </div>
            <div className="flex w-full gap-7.5">
                <div
                    className="group flex-1 cursor-pointer rounded-[.9375rem] bg-white p-[1.875rem_1.25rem_1.25rem_1.875rem] shadow-banner hover:bg-main-1"
                    onClick={() => naviagte(ROUTE.REGISTER_WARD)}
                >
                    <h2 className="font-apple text-[1.75rem] font-bold text-main-1 group-hover:text-white">병동 생성</h2>
                    <p className="font-apple text-[1rem] text-main-2 group-hover:text-main-4">병동을 새로 생성합니다.</p>
                    <RegisterWardIcon className="ml-auto h-12 w-12" />
                </div>
                <div
                    className="group flex-1 cursor-pointer rounded-[.9375rem] bg-white p-[1.875rem_1.25rem_1.25rem_1.875rem] shadow-banner hover:bg-main-1"
                    onClick={() => naviagte(ROUTE.ENTER_WARD)}
                >
                    <h2 className="font-apple text-[1.75rem] font-bold text-main-1 group-hover:text-white">병동 입장</h2>
                    <p className="font-apple text-[1rem] text-main-2 group-hover:text-main-4">기존에 생성되어 있는 병동에 입장합니다.</p>
                    <EnterWardIcon className="ml-auto h-12 w-12" />
                </div>
            </div>
        </div>
    );
}

export default SelectEnterOrCreate;
