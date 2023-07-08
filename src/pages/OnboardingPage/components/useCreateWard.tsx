import { useEffect, useState } from 'react';
import { shiftList as mockShiftList } from '@mocks/duty/data';
import { SetDivision, SetShift, SetStraight, SetWard } from '@components/Settings';

export type Step = {
  name: string;
  contents: JSX.Element;
  description: JSX.Element | null;
};

type CreateWardRequestDTO = Pick<
  Ward,
  | 'name'
  | 'nurseCnt'
  | 'maxContinuousNight'
  | 'maxContinuousWork'
  | 'minNightInterval'
  | 'levelDivision'
> & { hospitalName: string };

const useCreateWard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  // 추후 server state로 변경
  const [ward, setWard] = useState<CreateWardRequestDTO>({
    name: '',
    hospitalName: '',
    nurseCnt: 20,
    minNightInterval: 7,
    maxContinuousWork: 5,
    maxContinuousNight: 3,
    levelDivision: 4,
  });
  const [shiftList, setShiftList] = useState<ShiftList>(mockShiftList);
  const [isFilled, setIsFilled] = useState(false);
  const [error, setError] = useState<{ step: number; message: string } | null>(null);

  useEffect(() => {
    if (Object.values(ward).includes('')) {
      setIsFilled(false);
      setError({ step: currentStep, message: '빈 값을 채워주세요' });
      return;
    } else {
      setIsFilled(true);
      setError(null);
    }
  }, [ward, currentStep]);

  const handleChangeCreateWardRequestDTO = (
    key: keyof CreateWardRequestDTO,
    value: string | number
  ) => {
    setWard({ ...ward, [key]: value });
  };

  const steps: Step[] = [
    {
      name: '1 병동 • 간호사 정보',
      contents: (
        <SetWard.Contents
          wardName={ward.name}
          hospitalName={ward.hospitalName}
          nurseCount={ward.nurseCnt}
          setWardName={(value) => handleChangeCreateWardRequestDTO('name', value)}
          setHospitalName={(value) => handleChangeCreateWardRequestDTO('hospitalName', value)}
          setNurseCount={(value) => handleChangeCreateWardRequestDTO('nurseCnt', value)}
        />
      ),
      description: null,
    },
    {
      name: '2 숙련도 구분',
      contents: (
        <SetDivision.Contents
          levelDivistion={ward.levelDivision}
          setLevelDivision={(value) => handleChangeCreateWardRequestDTO('levelDivision', value)}
        />
      ),
      description: null,
    },
    {
      name: '3 연속 근무',
      contents: (
        <SetStraight.Contents
          maxContinuousWork={ward.maxContinuousWork}
          maxContinuousNight={ward.maxContinuousNight}
          minNightInterval={ward.minNightInterval}
          setMaxContinuousWork={(value) =>
            handleChangeCreateWardRequestDTO('maxContinuousWork', value)
          }
          setMaxContinuousNight={(value) =>
            handleChangeCreateWardRequestDTO('maxContinuousNight', value)
          }
          setMinNightInterval={(value) =>
            handleChangeCreateWardRequestDTO('minNightInterval', value)
          }
        />
      ),
      description: null,
    },
    {
      name: '4 근무 형태',
      contents: <SetShift.Contents shiftList={shiftList} setShiftList={setShiftList} />,
      description: null,
    },
  ];

  return {
    steps,
    currentStep,
    isFilled,
    error,
    setCurrentStep,
  };
};

export default useCreateWard;
