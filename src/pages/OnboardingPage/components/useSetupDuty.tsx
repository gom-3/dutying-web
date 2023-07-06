import { useState } from 'react';
import { shiftList as mockShiftList } from '@mocks/duty/data';
import { mockWard } from '@mocks/ward/data';
import { SetDivision, SetShift, SetStraight, SetWard } from '@components/Settings';

export type Step = {
  name: string;
  contents: JSX.Element;
  description: JSX.Element | null;
};

const useSetupDuty = () => {
  const [currentStep, setCurrentStep] = useState(0);
  // 추후 server state로 변경
  const [ward, setWard] = useState<Ward>(mockWard);
  const [shiftList, setShiftList] = useState<ShiftList>(mockShiftList);

  console.log(ward);

  const steps: Step[] = [
    {
      name: '1 병동 • 간호사 정보',
      contents: <SetWard.Contents ward={ward} setWard={(ward) => setWard(ward)} />,
      description: null,
    },
    {
      name: '2 숙련도 구분',
      contents: (
        <SetDivision.Contents
          levelDivistion={ward.levelDivision}
          setLevelDivision={(levelDivision) => setWard({ ...ward, levelDivision })}
        />
      ),
      description: null,
    },
    {
      name: '3 연속 근무',
      contents: <SetStraight.Contents ward={ward} setWard={(ward) => setWard(ward)} />,
      description: null,
    },
    {
      name: '4 근무 형태',
      contents: (
        <SetShift.Contents
          shiftList={shiftList}
          setShiftList={(shiftList) => setShiftList(shiftList)}
        />
      ),
      description: null,
    },
  ];

  return {
    steps,
    currentStep,
    setCurrentStep,
  };
};

export default useSetupDuty;
