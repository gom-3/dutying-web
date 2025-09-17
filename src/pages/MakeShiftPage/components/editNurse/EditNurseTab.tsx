import { type ChangeEvent } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';
import ShiftSelect from './ShiftSelect';

type Props = {
  isFixed?: boolean;
  close?: () => void;
};

const EditNurseTab = ({ isFixed, close }: Props) => {
  const {
    state: { selectedNurse },
    actions: { updateNurse },
  } = useEditShiftTeam();
  const tabRef = useOnclickOutside(() => {
    if (isFixed && close) {
      close();
    }
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedNurse) return;

    updateNurse(selectedNurse.nurseId, { ...selectedNurse, name: e.target.value });
  };

  return (
    selectedNurse && (
      <div
        ref={tabRef}
        className={`mt-7.5 ml-7.5 ${isFixed && 'fixed top-[50%] right-12 z-30 translate-y-[-50%]'}`}
      >
        {!isFixed && <div className="font-apple text-sub-3 mb-[.9375rem]">간호사별 관리</div>}
        <div
          style={{ height: 'calc(100vh - 19.5rem' }}
          className="shadow-banner flex w-md flex-col items-center rounded-[1.25rem] bg-white"
        >
          <div className="m-7.5 flex justify-start">
            <input
              className="text-text-1 w-1/2 text-[2rem] font-semibold"
              type="text"
              onChange={handleInputChange}
              value={selectedNurse.name}
              placeholder="이름"
            />
          </div>
          <div className="bg-sub-5 h-[.3125rem] w-full" />
          <div className="relative flex h-31.5 w-full items-center justify-center">
            <div className="font-apple text-sub-2.5 absolute top-[.6875rem] left-10 text-[1rem] font-medium">
              가능 근무
            </div>
            <div className="font-apple text-sub-3 absolute top-[.6857rem] right-7 text-[0.625rem] font-light">
              가능 근무를 모두 선택해주세요
            </div>
            <ShiftSelect mode="isPossible" />
          </div>
          <div className="bg-sub-5 h-[.3125rem] w-full" />
          <div className="relative flex h-31.5 w-full items-center justify-center">
            <div className="font-apple text-sub-2.5 absolute top-[.6875rem] left-10 text-[1rem] font-medium">
              선호 근무
            </div>
            <div className="font-apple text-sub-3 absolute top-[.6857rem] right-7 text-[0.625rem] font-light">
              선호도에 따라 듀티표에 추천될 예정입니다
            </div>
            <ShiftSelect mode="isPreferred" />
          </div>
        </div>
      </div>
    )
  );
};

export default EditNurseTab;
