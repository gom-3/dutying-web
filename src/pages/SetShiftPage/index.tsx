import 'index.css';
import Setting from './components/Setting';
import { useWardStore } from 'stores/wardStore';
import { useState } from 'react';
import Modal from './components/Modal';
import { shallow } from 'zustand/shallow';
import ShiftTypeSetting from './components/ShiftTypeSetting';

type ModalType = '숙련도' | '연속근무';

const SetShiftPage = () => {
  const { maxContinuosNight, maxContinuosWork, minNightInterval, levelDivision } = useWardStore();
  const wardName = useWardStore((state) => state.name, shallow);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<'숙련도' | '연속근무'>('숙련도');

  const handleClickPenIcon = (step: ModalType) => {
    setCurrentModal(step);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative h-[100vh] w-[100vw] p-[3.4375rem]">
      {isModalOpen && <div className="fixed left-0 top-0 z-20 h-[100vh] w-[100vw] bg-black/50" />}
      {isModalOpen && <Modal current={currentModal} close={closeModal} />}
      <div className="mb-[3.625rem] font-apple text-[2.25rem] text-text-1">
        {wardName}병동 근무 설정
      </div>
      <Setting name="숙련도" step="숙련도" value={`${levelDivision}`} edit={handleClickPenIcon} />
      <Setting
        name="최대 연속 근무"
        step="연속근무"
        value={`${maxContinuosWork}일`}
        edit={handleClickPenIcon}
      />
      <Setting
        name="최대 연속 나이트"
        step="연속근무"
        value={`${maxContinuosNight}일`}
        edit={handleClickPenIcon}
      />
      <Setting
        name="최소 나이트 간격"
        step="연속근무"
        value={`${minNightInterval}일`}
        edit={handleClickPenIcon}
      />
      <ShiftTypeSetting />
    </div>
  );
};

export default SetShiftPage;
