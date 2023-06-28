import { ChangeEvent, useEffect, useState } from 'react';
import 'index.css';
import ProficiencySelectBox from '@components/SingleSelectBox';
import ShiftSelectBox from '@components/ShiftSelectBox';

type Props = {
  nurse: Nurse;
  updateNurse: (id: number, updatedNurse: Nurse) => void;
};

const EditNurseTab = ({ nurse, updateNurse }: Props) => {
  const [name, setName] = useState(nurse.name);

  useEffect(() => {
    setName(nurse.name);
  }, [nurse]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="ml-[1.875rem] mt-[1.875rem]">
      <div className="mb-[.9375rem] font-apple text-sub-3">간호사별 관리</div>
      <div
        style={{ height: 'calc(100vh - 19.5rem' }}
        className="flex w-[28rem] flex-col items-center rounded-[1.25rem] bg-white shadow-shadow-1"
      >
        <div className="m-[1.875rem] flex justify-start">
          <div className="mr-[1.375rem] h-[3.625rem] w-[3.625rem] rounded-full bg-sub-3" />
          <input
            className="w-1/2 text-[2rem] font-semibold text-text-1"
            type="text"
            onChange={handleInputChange}
            value={name}
            placeholder="이름"
          />
        </div>
        <div className="h-[.3125rem] w-full bg-sub-5" />
        <div className="relative flex h-[7.875rem] w-full items-center justify-center">
          <div className="absolute left-[2.5rem] top-[.6875rem] font-apple text-[1rem] font-medium text-sub-2.5">
            숙련도
          </div>
          <ProficiencySelectBox
            nurse={nurse}
            updateNurse={updateNurse}
            devide={3}
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
          <ShiftSelectBox nurse={nurse} mode="avail" updateNurse={updateNurse} />
        </div>
        <div className="h-[.3125rem] w-full bg-sub-5" />
        <div className="relative flex h-[7.875rem] w-full items-center justify-center">
          <div className="absolute left-[2.5rem] top-[.6875rem] font-apple text-[1rem] font-medium text-sub-2.5">
            선호 근무
          </div>
          <div className="absolute right-[1.75rem] top-[.6857rem] font-apple text-[0.625rem] font-light text-sub-3">
            선호도에 따라 듀티표에 추천될 예정입니다
          </div>
          <ShiftSelectBox nurse={nurse} mode="prefer" updateNurse={updateNurse} />
        </div>
      </div>
    </div>
  );
};

export default EditNurseTab;
