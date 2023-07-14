import { useEffect, useState } from 'react';
import { SetDivision, SetShift, SetStraight, SetWard } from '@components/Settings';

export type Step = {
  name: string;
  contents: JSX.Element;
  description: JSX.Element | null;
};

export type CreateWardRequest = Pick<
  Ward,
  | 'name'
  | 'nurseCnt'
  | 'maxContinuousNight'
  | 'maxContinuousWork'
  | 'minNightInterval'
  | 'levelDivision'
> & { hospitalName: string };

export type CreateShiftTypeRequest = Omit<ShiftType, 'shiftTypeId' | 'wardId'>;
export type CreateShiftTypeListRequest = CreateShiftTypeRequest[];

const useCreateWard = () => {
  // 서버에 POST 요청을 보내기 위한 data
  const [ward, setWard] = useState<CreateWardRequest>({
    name: '',
    hospitalName: '',
    nurseCnt: 20,
    minNightInterval: 7,
    maxContinuousWork: 5,
    maxContinuousNight: 3,
    levelDivision: 4,
  });
  const [shiftTypeList, setShiftTypeList] = useState<CreateShiftTypeListRequest>([
    {
      name: '오프',
      shortName: 'O',
      startTime: '00:00',
      endTime: '00:00',
      hotkey: ['/', 'o', 'O', '0'],
      isDefault: true,
      isOff: true,
      color: '#5534E0',
    },
    {
      name: '데이',
      shortName: 'D',
      startTime: '07:00',
      endTime: '15:00',
      hotkey: ['D', 'd', 'ㅇ', '1'],
      isDefault: true,
      isOff: false,
      color: '#D7EB2A',
    },
    {
      name: '이브닝',
      shortName: 'E',
      startTime: '15:00',
      endTime: '23:00',
      hotkey: ['E', 'e', 'ㄷ', '2'],
      isDefault: true,
      isOff: false,
      color: '#EB39E8',
    },
    {
      name: '나이트',
      shortName: 'N',
      startTime: '23:00',
      endTime: '07:00',
      hotkey: ['N', 'n', 'ㅜ', '3'],
      isDefault: true,
      isOff: false,
      color: '#271F3E',
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
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
    key: keyof CreateWardRequest,
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
      contents: <SetShift shiftTypeList={shiftTypeList} setShiftTypeList={setShiftTypeList} />,
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
