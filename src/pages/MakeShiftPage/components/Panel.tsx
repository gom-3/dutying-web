import { event, sendEvent } from 'analytics';
import useEditShift from '@hooks/useEditShift';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';
import { RestoreIcon, RestoreIconDisable } from '@assets/svg';

function Panel() {
  const {
    state: { faults, histories },
    actions: { moveHistory },
  } = useEditShift();
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('histories');

  return (
    <div
      className={twMerge(
        'mb-[3.125rem] mt-[1.25rem] flex w-[13.625rem] shrink-0 flex-col rounded-[1.25rem] bg-white shadow-shadow-1',
        open && 'absolute bottom-0 right-0 h-[300%] max-h-[calc(50vh)]'
      )}
    >
      <div className="flex h-[2.5rem] w-full border-b-[.0313rem] border-sub-4 font-apple text-base font-medium">
        <div
          className={`flex h-[2.5rem] flex-1 cursor-pointer items-center justify-center rounded-tl-[1.25rem] border-r-[.0313rem] border-sub-4 
          ${currentTab === 'histories' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'}`}
          onClick={() => {
            setCurrentTab('histories');
            sendEvent(event.clickFaultTab);
          }}
        >
          기록
        </div>
        <div
          className={`flex h-[2.5rem] flex-1 cursor-pointer items-center justify-center rounded-tr-[1.25rem] 
          ${currentTab === 'faults' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'}`}
          onClick={() => {
            setCurrentTab('faults');
            sendEvent(event.clickHistoryTab);
          }}
        >
          <p className="relative">
            문제점
            <span className="absolute right-0 top-0 flex h-[.875rem] w-[.875rem] translate-x-[100%] items-center justify-center rounded-full bg-main-2 font-apple text-[.625rem] text-white">
              {[...faults.values()].length}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-scroll scrollbar-hide">
        {currentTab === 'faults'
          ? [...faults.values()].map((fault, index) => (
              <p
                key={index}
                className="border-b-[.0313rem] border-sub-4 px-[.8125rem] py-[.625rem] font-apple text-[.75rem] text-sub-2 last:border-none"
              >
                {fault.focus.shiftNurseName} / {fault.focus.day + 1}일: {fault.message}
              </p>
            ))
          : histories &&
            [...histories.history].reverse().map((history, index) => {
              const isPrev = histories.history.length - index - 1 > histories.current;
              return (
                <div
                  key={index}
                  className={`flex cursor-pointer gap-[.625rem] border-b-[.0313rem] border-sub-4 px-[.8125rem] py-[.625rem] font-apple text-[.75rem] last:border-none ${
                    isPrev ? 'text-sub-3' : 'text-sub-2'
                  }`}
                  onClick={() =>
                    moveHistory(histories.history.length - index - 1 - histories.current)
                  }
                >
                  {history.focus.shiftNurseName} / {history.focus.day + 1}일
                  <div className="h-full w-[.0313rem] bg-sub-3" />
                  {match(history)
                    .with(
                      { prevShiftType: null },
                      () => `추가 → ${history.nextShiftType?.shortName}`
                    )
                    .with(
                      { nextShiftType: null },
                      () => `${history.prevShiftType?.shortName} → 삭제`
                    )
                    .otherwise(
                      () =>
                        `${history.prevShiftType?.shortName} → ${history.nextShiftType?.shortName}`
                    )}
                  {isPrev ? (
                    <RestoreIconDisable className="ml-auto h-[1.125rem] w-[1.125rem]" />
                  ) : (
                    <RestoreIcon className="ml-auto h-[1.125rem] w-[1.125rem]" />
                  )}
                </div>
              );
            })}
      </div>
      <div
        className="flex h-[1.875rem] w-full cursor-pointer items-center justify-center  font-apple text-[.625rem] text-main-3"
        onClick={() => setOpen(!open)}
      >
        {open ? '닫기' : '펼치기'}
      </div>
    </div>
  );
}

export default Panel;
