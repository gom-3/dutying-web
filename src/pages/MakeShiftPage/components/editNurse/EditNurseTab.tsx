import { ChangeEvent } from 'react';
import ShiftSelect from './ShiftSelect';
import useOnclickOutside from 'react-cool-onclickoutside';
import useEditNurse from '@hooks/useEditNurse';

type Props = {
  isFixed?: boolean;
  close?: () => void;
};

const EditNurseTab = ({ isFixed, close }: Props) => {
  const {
    state: { selectedNurse },
    actions: { updateNurse },
  } = useEditNurse();

  const tabRef = useOnclickOutside(() => {
    if (isFixed && close) {
      close();
    }
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedNurse) return;
    updateNurse({ ...selectedNurse, name: e.target.value });
  };

  return (
    selectedNurse && (
      <div
        ref={tabRef}
        className={`ml-[1.875rem] mt-[1.875rem] ${
          isFixed && 'fixed right-[3rem] top-[50%] z-30 translate-y-[-50%]'
        }`}
      >
        {!isFixed && <div className="mb-[.9375rem] font-apple text-sub-3">간호사별 관리</div>}
        <div
          style={{ height: 'calc(100vh - 19.5rem' }}
          className="flex w-[28rem] flex-col items-center rounded-[1.25rem] bg-white shadow-shadow-1"
        >
          <div className="m-[1.875rem] flex justify-start">
            <input
              className="w-1/2 text-[2rem] font-semibold text-text-1"
              type="text"
              onChange={handleInputChange}
              value={selectedNurse.name}
              placeholder="이름"
            />
          </div>
          <div className="h-[.3125rem] w-full bg-sub-5" />
          <div className="relative flex h-[7.875rem] w-full items-center justify-center">
            <div className="absolute left-[2.5rem] top-[.6875rem] font-apple text-[1rem] font-medium text-sub-2.5">
              가능 근무
            </div>
            <div className="absolute right-[1.75rem] top-[.6857rem] font-apple text-[0.625rem] font-light text-sub-3">
              가능 근무를 모두 선택해주세요
            </div>
            <ShiftSelect mode="isPossible" />
          </div>
          <div className="h-[.3125rem] w-full bg-sub-5" />
          <div className="relative flex h-[7.875rem] w-full items-center justify-center">
            <div className="absolute left-[2.5rem] top-[.6875rem] font-apple text-[1rem] font-medium text-sub-2.5">
              선호 근무
            </div>
            <div className="absolute right-[1.75rem] top-[.6857rem] font-apple text-[0.625rem] font-light text-sub-3">
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
