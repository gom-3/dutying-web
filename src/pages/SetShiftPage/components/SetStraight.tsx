import Select from '@components/Select';
import useEditWard from '@hooks/useEditWard';

function SetStraight() {
  const {
    state: { tempWard },
    actions: { changeTempWard },
  } = useEditWard();

  return tempWard ? (
    <div className="flex h-full w-full justify-evenly py-[20px]">
      <div className="relative flex flex-[1] items-center justify-center border-r-[.0625rem] border-sub-4 px-[4.6875rem]">
        <p className="absolute left-[50%] top-[1.125rem] translate-x-[-50%] font-apple text-[1.5rem] text-sub-3">
          연속 근무 수
        </p>
        <div className="flex items-center gap-[1.25rem]">
          <p className="font-base font-apple text-[1.5rem] text-sub-2.5">최대</p>
          <Select
            className="h-[3.375rem] w-[6.25rem] text-[2.125rem] text-sub-2.5"
            value={tempWard.maxContinuousWork}
            onChange={(e) => changeTempWard('maxContinuousWork', parseInt(e.target.value))}
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
            value={tempWard.maxContinuousNight}
            onChange={(e) => changeTempWard('maxContinuousNight', parseInt(e.target.value))}
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
            value={tempWard.minNightInterval}
            onChange={(e) => changeTempWard('minNightInterval', parseInt(e.target.value))}
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
  ) : null;
}

export default SetStraight;
