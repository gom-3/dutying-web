import React, { useEffect, useState } from 'react';
import 'index.css';

interface Props {
  id: number;
  nurse: Nurse;
  updateNurse: (id: number, updatedNurse: Nurse) => void;
  devide: number;
  proficiency: number;
}

const ProficiencySelectBox = ({ id, nurse, updateNurse, devide, proficiency }: Props) => {
  const [currentProficiency, setCurrentProficiency] = useState(proficiency);
  const width = ['', '', 'w-[12.1875rem]', 'w-[16.875rem]', 'w-[21.5625rem]'];

  useEffect(() => {
    setCurrentProficiency(proficiency);
  }, [proficiency]);

  useEffect(() => {
    const updatedNurse = { ...nurse, proficiency: currentProficiency };
    updateNurse(id, updatedNurse);
  }, [currentProficiency]);

  const handleOnClick = (i: number) => {
    setCurrentProficiency(i);
  };

  return (
    <div className={`flex ${width[devide - 1]} mt-4 justify-between`}>
      {Array.from({ length: devide }).map((option, i) => {
        return (
          <div
            className={`flex h-[2.8125rem] w-[2.8125rem] cursor-pointer items-center justify-center rounded-[0.3125rem] font-poppins text-[1.25rem] ${
              currentProficiency === devide - i
                ? 'bg-main-2 text-white'
                : 'border border-sub-3 text-sub-3'
            }`}
            onClick={() => handleOnClick(devide - i)}
          >
            {devide - i}
          </div>
        );
      })}
    </div>
  );
};

export default ProficiencySelectBox;
