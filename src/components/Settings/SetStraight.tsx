import Select from '@components/Select';

/* eslint-disable react-refresh/only-export-components */
interface ContentsProps {
  ward: Ward;
  setWard: (ward: Ward) => void;
}

function Contents({ ward, setWard }: ContentsProps) {
  console.log(ward);
  return (
    <div className="flex h-full w-full justify-evenly">
      <div className="flex flex-[1] items-center justify-center border-r-[.0625rem] border-sub-4 px-[4.6875rem]">
        <p className="left-[50%] top-[2.375rem] translate-x-[-50%] self-start font-apple text-[1.5rem] text-sub-3">
          연속 근무 수
        </p>
        <div className="flex items-center gap-[1.25rem]">
          <p className="font-base font-apple text-[1.5rem] text-sub-2.5">최대</p>
          <Select
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            value={ward.maxContinuousWork}
            onChange={(e) => setWard({ ...ward, maxContinuousWork: parseInt(e.target.value) })}
            options={[
              { value: 4, label: '4일' },
              { value: 5, label: '5일' },
              { value: 6, label: '6일' },
            ]}
          />
        </div>
      </div>
      <div className="relative flex flex-[1] items-center justify-center border-r-[.0625rem] border-sub-4 px-[4.6875rem]">
        <p className="absolute left-[50%] top-[2.375rem] translate-x-[-50%] font-apple text-[1.5rem] text-sub-3">
          연속 나이트
        </p>
        <div className="flex items-center gap-[1.25rem]">
          <p className="font-base font-apple text-[1.5rem] text-sub-2.5">최대</p>
          <Select
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            value={ward.maxContinuousNight}
            onChange={(e) => setWard({ ...ward, maxContinuousNight: parseInt(e.target.value) })}
            options={[
              { value: 3, label: '3일' },
              { value: 4, label: '4일' },
              { value: 5, label: '5일' },
            ]}
          />
        </div>
      </div>
      <div className="relative flex flex-[1] items-center justify-center border-r-[.0625rem] border-sub-4 px-[4.6875rem]">
        <p className="absolute left-[50%] top-[2.375rem] translate-x-[-50%] font-apple text-[1.5rem] text-sub-3">
          나이트 간격
        </p>
        <div className="flex items-center gap-[1.25rem]">
          <p className="font-base font-apple text-[1.5rem] text-sub-2.5">최소</p>
          <Select
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            value={ward.minNightInterval}
            onChange={(e) => setWard({ ...ward, minNightInterval: parseInt(e.target.value) })}
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
