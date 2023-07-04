import { useEffect, useState } from 'react';
import 'index.css';

interface Props {
  nurse: Nurse;
  updateNurse: (id: number, updatedNurse: Nurse) => void;
  devide: number;
}

const LevelSelect = ({ nurse, updateNurse, devide }: Props) => {
  const [currentProficiency, setCurrentProficiency] = useState(nurse.proficiency);
  const width = ['', '', 'w-[12.1875rem]', 'w-[16.875rem]', 'w-[21.5625rem]'];

  useEffect(() => {
    setCurrentProficiency(nurse.proficiency);
  }, [nurse]);

  useEffect(() => {
    const updatedNurse = { ...nurse, proficiency: currentProficiency };
    updateNurse(nurse.id, updatedNurse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProficiency]);

  const handleOnClick = (i: number) => {
    setCurrentProficiency(i);
  };

  return (
    <div className={`flex ${width[devide - 1]} mt-4 justify-between`}>
      {Array.from({ length: devide }).map((_option, i) => {
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

export default LevelSelect;
