import Select from '@components/Select';

/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  maxContinuousWork: number;
  maxContinuousNight: number;
  minNightInterval: number;
  setMaxContinuousWork: (maxContinuousWork: number) => void;
  setMaxContinuousNight: (maxContinuousNight: number) => void;
  setMinNightInterval: (minNightInterval: number) => void;
}

function Contents({
  maxContinuousWork,
  maxContinuousNight,
  minNightInterval,
  setMaxContinuousWork,
  setMaxContinuousNight,
  setMinNightInterval: setNightInterval,
}: ContentsProps) {
  return (
    <div className="flex h-full w-full justify-evenly py-[20px]">
      <div className="relative flex flex-[1] items-center justify-center border-r-[.0625rem] border-sub-4 px-[4.6875rem]">
        <p className="absolute left-[50%] top-[1.125rem] translate-x-[-50%] font-apple text-[1.5rem] text-sub-3">
          연속 근무 수
        </p>
        <div className="flex items-center gap-[1.25rem]">
          <p className="font-base font-apple text-[1.5rem] text-sub-2.5">최대</p>
          <Select
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            value={maxContinuousWork}
            onChange={(e) => setMaxContinuousWork(parseInt(e.target.value))}
            options={[
              { value: 4, label: '4일' },
              { value: 5, label: '5일' },
              { value: 6, label: '6일' },
            ]}
          />
        </div>
      </div>
      <div className="relative flex flex-[1] items-center justify-center border-r-[.0625rem] border-sub-4 px-[4.6875rem]">
        <p className="absolute left-[50%] top-[1.125rem] translate-x-[-50%] font-apple text-[1.5rem] text-sub-3">
          연속 나이트
        </p>
        <div className="flex items-center gap-[1.25rem]">
          <p className="font-base font-apple text-[1.5rem] text-sub-2.5">최대</p>
          <Select
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            value={maxContinuousNight}
            onChange={(e) => setMaxContinuousNight(parseInt(e.target.value))}
            options={[
              { value: 3, label: '3일' },
              { value: 4, label: '4일' },
              { value: 5, label: '5일' },
            ]}
          />
        </div>
      </div>
      <div className="relative flex flex-[1] items-center justify-center px-[4.6875rem]">
        <p className="absolute left-[50%] top-[1.125rem] translate-x-[-50%] font-apple text-[1.5rem] text-sub-3">
          나이트 간격
        </p>
        <div className="flex items-center gap-[1.25rem]">
          <p className="font-base font-apple text-[1.5rem] text-sub-2.5">최소</p>
          <Select
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            value={minNightInterval}
            onChange={(e) => setNightInterval(parseInt(e.target.value))}
            options={[
              { value: 3, label: '3일' },
              { value: 4, label: '4일' },
              { value: 5, label: '5일' },
              { value: 6, label: '6일' },
              { value: 7, label: '7일' },
              { value: 8, label: '8일' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="mx-auto flex h-full w-[80%] flex-col justify-center gap-3">
      <p className="font-apple text-[1.5rem] text-sub-2">
        나이트는 최소 2일 이상 연속 배정이 가능합니다.
      </p>
    </div>
  );
}

export default { Contents, Description };
