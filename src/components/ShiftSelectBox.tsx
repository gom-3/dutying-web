import 'index.css';
import { useState } from 'react';

interface Props {
  options: boolean[];
}

const ShiftSelectBox = ({ options }: Props) => {
  const [isSelected, setIsSelected] = useState(options);

  const handleOnClick = (i: number) => {
    const temp = [...isSelected];
    temp[i] = !temp[i];
    setIsSelected(temp);
  };

  return (
    <div className="mt-4 flex">
      <div
        onClick={() => handleOnClick(0)}
        className={`mr-[1.25rem] flex h-[2.8125rem] w-[5.875rem] cursor-pointer items-center justify-center rounded-[.3125rem] ${
          isSelected[0] ? 'bg-main-2 text-white' : 'border border-sub-3 text-sub-3'
        } `}
      >
        데이
      </div>
      <div
        onClick={() => handleOnClick(1)}
        className={`mr-[1.25rem] flex h-[2.8125rem] w-[5.875rem] cursor-pointer items-center justify-center rounded-[.3125rem] ${
          isSelected[1] ? 'bg-main-2 text-white' : 'border border-sub-3 text-sub-3'
        } `}
      >
        이브닝
      </div>
      <div
        onClick={() => handleOnClick(2)}
        className={`flex h-[2.8125rem] w-[5.875rem] cursor-pointer items-center justify-center rounded-[.3125rem] ${
          isSelected[2] ? 'bg-main-2 text-white' : 'border border-sub-3 text-sub-3'
        } `}
      >
        나이트
      </div>
    </div>
  );
};

export default ShiftSelectBox;
