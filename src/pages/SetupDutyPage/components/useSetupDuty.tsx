import { useState } from 'react';
import Rotation from './steps/Rotation';
import Request from './steps/Request';
import Straight from './steps/Straight';
import Interval from './steps/Interval';
import Standard from './steps/Standard';
import Shift from './steps/Shift';
import { dutyConstraint as mockDutyConstraint, shiftList } from '@mocks/duty/data';

export type Step = {
  name: string;
  contents: JSX.Element;
  description: JSX.Element | null;
};

const useSetupDuty = () => {
  const [currentStep, setCurrentStep] = useState(0);
  // 추후 server state로 변경
  const [dutyConstraint, setDutyConstraint] = useState<DutyConstraint>(mockDutyConstraint);

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
      contents: (
        <Straight.Contents
          shiftList={shiftList}
          straight={dutyConstraint.straight}
          setStraight={(straight) => setDutyConstraint({ ...dutyConstraint, straight })}
        />
      ),
      description: <Straight.Description />,
    },
    {
      name: '나이트 간격',
      contents: (
        <Interval.Contents
          currentRotation={dutyConstraint.rotation}
          setCurrentRotation={(rotation) => setDutyConstraint({ ...dutyConstraint, rotation })}
        />
      ),
      description: null,
    },
    {
      name: '근무 수',
      contents: (
        <Standard.Contents
          currentRotation={dutyConstraint.rotation}
          setCurrentRotation={(rotation) => setDutyConstraint({ ...dutyConstraint, rotation })}
        />
      ),
      description: <Standard.Description />,
    },
    {
      name: '근무 형태',
      contents: (
        <Shift.Contents
          currentRotation={dutyConstraint.rotation}
          setCurrentRotation={(rotation) => setDutyConstraint({ ...dutyConstraint, rotation })}
        />
      ),
      description: null,
    },
    {
      name: '근무신청 제한',
      contents: (
        <Request.Contents
          currentRotation={dutyConstraint.rotation}
          setCurrentRotation={(rotation) => setDutyConstraint({ ...dutyConstraint, rotation })}
        />
      ),
      description: null,
    },
  ];

  return {
    step,
    currentStep,
    setCurrentStep,
  };
};

export default useSetupDuty;
