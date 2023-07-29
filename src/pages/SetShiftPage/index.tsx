import 'index.css';
import Setting from './components/Setting';
import Modal from './components/Modal';
import ShiftTypeSetting from './components/ShiftTypeSetting';
import useEditWard from '@hooks/useEditWard';
import { useState } from 'react';

const SetShiftPage = () => {
  const {
    state: { ward },
  } = useEditWard();
  const [currentModal, changeOpenModal] = useState<'숙련도' | '연속근무' | null>(null);

  return ward ? (
    <div className="relative h-[100vh] w-[100vw] overflow-y-scroll p-[3.4375rem]">
      {currentModal && (
        <Modal currentModal={currentModal} closeModal={() => changeOpenModal(null)} />
      )}
      <div className="mb-[3.625rem] font-apple text-[2.25rem] text-text-1">
        {ward.name}병동 근무 설정
      </div>
      {[
        {
          name: '숙련도',
          value: ward.levelDivision,
          handleClick: () => changeOpenModal('숙련도'),
        },
        {
          name: '최대 연속 근무',
          value: ward.maxContinuousWork,
          handleClick: () => changeOpenModal('연속근무'),
        },
        {
          name: '최대 연속 나이트',
          value: ward.maxContinuousNight,
          handleClick: () => changeOpenModal('연속근무'),
        },
        {
          name: '최소 나이트 간격',
          value: ward.minNightInterval,
          handleClick: () => changeOpenModal('연속근무'),
        },
      ].map(({ name, value, handleClick }) => (
        <Setting key={name} name={name} value={value} handleClick={handleClick} />
      ))}
      <ShiftTypeSetting />
    </div>
  ) : null;
};

export default SetShiftPage;
