import 'index.css';
import { useEffect, useState } from 'react';

interface Props {
  nurse: Nurse;
  mode: 'isPreferred' | 'isPossible';
  updateNurse: (id: number, updatedNurse: Nurse) => void;
}

const ShiftSelect = ({ nurse, updateNurse, mode }: Props) => {
  const [isSelected, setIsSelected] = useState(nurse.nurseShiftTypes);

  console.log(nurse, isSelected);

  useEffect(() => {
    setIsSelected(nurse.nurseShiftTypes);
  }, [nurse]);

  const handleOnClick = (i: number) => {
    const temp = [...isSelected];
    temp[i][mode] = !temp[i][mode];
    const updatedNurse: Nurse = {
      ...nurse,
      nurseShiftTypes: temp,
    };
    updateNurse(nurse.nurseId, updatedNurse);
    setIsSelected(temp);
  };

  return (
    <div className="mt-4 flex">
      <div
        onClick={() => handleOnClick(0)}
        className={`mr-[1.25rem] flex h-[2.8125rem] w-[5.875rem] cursor-pointer items-center justify-center rounded-[.3125rem] ${
          isSelected[0][mode] ? 'bg-main-2 text-white' : 'border border-sub-3 text-sub-3'
        } `}
      >
        데이
      </div>
      <div
        onClick={() => handleOnClick(1)}
        className={`mr-[1.25rem] flex h-[2.8125rem] w-[5.875rem] cursor-pointer items-center justify-center rounded-[.3125rem] ${
          isSelected[1][mode] ? 'bg-main-2 text-white' : 'border border-sub-3 text-sub-3'
        } `}
      >
        이브닝
      </div>
      <div
        onClick={() => handleOnClick(2)}
        className={`flex h-[2.8125rem] w-[5.875rem] cursor-pointer items-center justify-center rounded-[.3125rem] ${
          isSelected[2][mode] ? 'bg-main-2 text-white' : 'border border-sub-3 text-sub-3'
        } `}
      >
        나이트
      </div>
    </div>
  );
};

export default ShiftSelect;
