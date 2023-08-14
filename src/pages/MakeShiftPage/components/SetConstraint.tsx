/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ArrowDownIcon, ToggleOffIcon, ToggleOnIcon } from '@assets/svg';
import { useState } from 'react';
import { match } from 'ts-pattern';

const Select = ({
  value,
  onChange,
  options,
}: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
  options: number[];
}) => (
  <div className="relative mx-[.3125rem] h-[2.75rem] w-[4.1875rem]">
    <ArrowDownIcon className="absolute right-[.625rem] top-[50%] h-[1.5625rem] w-[1.5625rem] translate-y-[-50%]" />
    <select
      value={value}
      onChange={onChange}
      className="relative z-10 h-full w-full appearance-none rounded-[.3125rem] bg-transparent px-[0.9375rem] text-left font-apple outline outline-[.0625rem] outline-main-4"
    >
      {options?.map((option, _) => (
        <option key={_} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const SetConstraint = () => {
  const [data] = useState<
    { type: FaultType; label: string; value: number | null; isActive: boolean }[]
  >([
    {
      type: 'maxContinuousWork',
      label: '연속 근무 수',
      value: 3,
      isActive: true,
    },
    {
      type: 'maxContinuousNight',
      label: '연속 나이트',
      value: 3,
      isActive: true,
    },
    {
      type: 'minContinuousNight',
      label: '연속 나이트',
      value: 2,
      isActive: true,
    },
    {
      type: 'minNightInterval',
      label: '나이트 간격',
      value: 3,
      isActive: true,
    },
    {
      type: 'offAfterNight',
      label: '나이트 근무 후 오프 배정',
      value: 2,
      isActive: true,
    },
    {
      type: 'noNightBeforeReqOff',
      label: '신청 오프 전날에는 나이트 근무 불가능',
      value: null,
      isActive: false,
    },
    {
      type: 'ed',
      label: 'ND / ED / NE / NOD 근무 형태 불가능',
      value: null,
      isActive: true,
    },
  ]);
  return (
    <div className="flex w-full flex-col font-apple">
      {data.map(({ type, label, value, isActive }) => (
        <div
          key={type}
          className="flex h-[4.625rem] items-center border-b-[.0313rem] border-sub-4.5 px-[2.5rem] last:border-none"
        >
          <p className="text-[1.25rem] text-sub-1">{label}</p>
          {match(type)
            .with('maxContinuousWork', () => (
              <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                최대 <Select value={value!} options={[3, 4, 5]} className="w-[4.125rem]" /> 일&nbsp;
                <span className="underline">이하</span>
              </div>
            ))
            .with('maxContinuousNight', () => (
              <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                최대 <Select value={value!} options={[3, 4, 5]} className="w-[4.125rem]" /> 일&nbsp;
                <span className="underline">이하</span>
              </div>
            ))
            .with('minContinuousNight', () => (
              <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                최대 <Select value={value!} options={[3, 4, 5]} className="w-[4.125rem]" /> 일&nbsp;
                <span className="underline">이하</span>
              </div>
            ))
            .with('minNightInterval', () => (
              <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                최대 <Select value={value!} options={[3, 4, 5]} className="w-[4.125rem]" /> 일&nbsp;
                <span className="underline">이하</span>
              </div>
            ))
            .with('offAfterNight', () => (
              <div className="ml-2 flex items-center text-[1.25rem] text-main-1">
                최대 <Select value={value!} options={[3, 4, 5]} className="w-[4.125rem]" /> 일&nbsp;
              </div>
            ))
            .otherwise(() => null)}
          {isActive ? (
            <div className="ml-auto flex w-[6.5625rem] items-center justify-between">
              <ToggleOnIcon className="h-[1rem] w-[1.875rem]" />
              <p className="w-[4.125rem] text-center text-[.75rem] text-sub-3">근무표 적용</p>
            </div>
          ) : (
            <div className="ml-auto flex w-[6.5625rem] items-center justify-between">
              <ToggleOffIcon className="h-[1rem] w-[1.875rem]" />
              <p className="w-[4.125rem] text-center text-[.75rem] text-sub-3">근무표 미적용</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SetConstraint;
