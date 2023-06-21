import { useState } from 'react';
import Rotation from './steps/Rotation';

export type Step = {
  name: string;
  contents: JSX.Element;
  description: JSX.Element;
};

const useSetupDuty = () => {
  const [currentStep, setCurrentStep] = useState(0);
  // 추후 server state로 변경
  const [dutyConstraint, setDutyConstraint] = useState<DutyConstraint>({
    rotation: 3,
    dutyStandard: {
      workday: [6, 5, 4, 4],
      weekend: [7, 4, 4, 4],
    },
    requestDutyType: 'all',
    nightInterval: 7,
    straight: 4,
  });

  const step: Step[] = [
    {
      name: '교대 수',
      contents: (
        <Rotation.Contents
          currentRotation={dutyConstraint.rotation}
          setCurrentRotation={(rotation) => setDutyConstraint({ ...dutyConstraint, rotation })}
        />
      ),
      description: <Rotation.Description />,
    },
    {
      name: '연속 근무 수',
      contents: <div>연속 근무 수</div>,
      description: <div></div>,
    },
    {
      name: '나이트 간격',
      contents: <div>나이트 간격</div>,
      description: <div></div>,
    },
    {
      name: '근무 수',
      contents: <div>근무 수</div>,
      description: <div></div>,
    },
    {
      name: '근무 형태',
      contents: <div>근무 형태</div>,
      description: <div></div>,
    },
    {
      name: '근무신청 제한',
      contents: <div>근무신청 제한</div>,
      description: <div></div>,
    },
  ];

  return {
    step,
    currentStep,
    setCurrentStep,
  };
};

export default useSetupDuty;
