import 'index.css';
import Setting from './components/Setting';
import { useWardStore } from 'stores/wardStore';
import useCreateWard from '@pages/OnboardingPage/components/useCreateWard';
import { useState } from 'react';
import Modal from './components/Modal';

const DutySetupPage = () => {
  const { maxContinuosNight, maxContinuosShift, minNightInterval } = useWardStore();
  const { steps } = useCreateWard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(0);

  const handleClickPenIcon = (modal: number) => {
    setCurrentModal(modal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(maxContinuosNight);
  return (
    <div className="relative w-[100vw] p-[3.4375rem]">
      {isModalOpen && <div className="fixed left-0 top-0 z-20 h-[100vh] w-[100vw] bg-black/50" />}
      {isModalOpen && <Modal steps={steps} current={currentModal} close={closeModal} />}
      <div className="mb-[3.625rem] font-apple text-[2.25rem] text-text-1">xx병동 근무 설정</div>
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
      <Setting name="근무 유형" value="5일" modal={3} edit={handleClickPenIcon} />
    </div>
  );
};

export default DutySetupPage;
