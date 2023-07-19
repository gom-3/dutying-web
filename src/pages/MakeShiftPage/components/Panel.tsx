import { useState } from 'react';
import { match } from 'ts-pattern';

interface Props {
  faults: Map<string, Fault>;
  histories: EditHistory[];
}

function Panel({ faults, histories }: Props) {
  const [currentTab, setCurrentTab] = useState('faults');

  return (
    <div className="mb-[3.125rem] mt-[1.25rem] flex w-[13.625rem] flex-col rounded-[1.25rem] bg-white shadow-shadow-1">
      <div className="flex h-[2.5rem] w-full border-b-[.0313rem] border-sub-4 font-apple text-base font-medium">
        <div
          className={`flex flex-1 cursor-pointer items-center justify-center rounded-tl-[1.25rem] border-r-[.0313rem] border-sub-4 ${
            currentTab === 'faults' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'
          }`}
          onClick={() => setCurrentTab('faults')}
        >
          문제점
        </div>
        <div
          className={`flex flex-1 cursor-pointer items-center justify-center rounded-tr-[1.25rem] ${
            currentTab === 'histories' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'
          }`}
          onClick={() => setCurrentTab('histories')}
        >
          기록
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-scroll scrollbar-hide">
        {currentTab === 'faults'
          ? [...faults.values()].map((fault, index) => (
              <p
                key={index}
                className="border-b-[.0313rem] border-sub-4 px-[.8125rem] py-[.625rem] font-apple text-[.75rem] text-sub-2 last:border-none"
              >
                {fault.nurse.name} / {fault.focus.day + 1}일: {fault.message}
              </p>
            ))
          : [...histories].reverse().map((history, index) => (
              <p
                key={index}
                className="border-b-[.0313rem] border-sub-4 px-[.8125rem] py-[.625rem] font-apple text-[.75rem] text-sub-2 last:border-none"
              >
                {history.nurse.name} / {history.focus.day + 1}일 |{' '}
                {match(history)
                  .with({ prevShiftType: null }, () => `추가 → ${history.nextShiftType?.shortName}`)
                  .with({ nextShiftType: null }, () => `${history.prevShiftType?.shortName} → 삭제`)
                  .otherwise(
                    () =>
                      `${history.prevShiftType?.shortName} → ${history.nextShiftType?.shortName}`
                  )}
              </p>
            ))}
      </div>
      <div className="flex h-[1.875rem] w-full cursor-pointer items-center justify-center  font-apple text-[.625rem] text-main-3">
        더보기
      </div>
    </div>
  );
}

export default Panel;
