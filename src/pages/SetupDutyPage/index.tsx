import 'index.css';
import Setting from './components/Setting';
import { useWardStore } from 'stores/wardStore';
import useCreateWard from '@pages/OnboardingPage/components/useCreateWard';
import { useState } from 'react';
import Modal from './components/Modal';
import { shallow } from 'zustand/shallow';
import { useShiftList } from 'stores/shiftStore';
import ShiftTypeSetting from './components/ShiftTypeSetting';

const DutySetupPage = () => {
  const { maxContinuosNight, maxContinuosShift, minNightInterval } = useWardStore();
  const { steps } = useCreateWard();
  const wardName = useWardStore((state) => state.name, shallow);
  const shiftList = useShiftList();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(0);

  console.log(wardName, shiftList);

  const handleClickPenIcon = (modal: number) => {
    setCurrentModal(modal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-[100vw] h-[100vh] p-[3.4375rem]">
      {isModalOpen && <div className="fixed left-0 top-0 z-20 h-[100vh] w-[100vw] bg-black/50" />}
      {isModalOpen && <Modal steps={steps} current={currentModal} close={closeModal} />}
      <div className="mb-[3.625rem] font-apple text-[2.25rem] text-text-1">
        {wardName}병동 근무 설정
      </div>
      <Setting
        name="최대 연속 근무"
        value={`${maxContinuosShift}일`}
        modal={1}
        edit={handleClickPenIcon}
      />
      <Setting
        name="최대 연속 나이트"
        value={`${maxContinuosNight}일`}
        modal={2}
        edit={handleClickPenIcon}
      />
      <Setting
        name="최소 나이트 간격"
        value={`${minNightInterval}일`}
        modal={2}
        edit={handleClickPenIcon}
      />
      <ShiftTypeSetting shiftList={shiftList} steps={steps} />
    </div>
  );
};

export default DutySetupPage;
