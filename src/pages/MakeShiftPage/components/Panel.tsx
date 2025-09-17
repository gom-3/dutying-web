import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';
import { RestoreIcon, RestoreIconDisable } from '@/assets/svg';
import useEditShift from '@/hooks/shift/useEditShift';
import { events, sendEvent } from 'analytics';

function Panel() {
  const {
    state: { readonly, faults, histories, shiftStatus, shift },
    actions: { moveHistory, changeFocus },
  } = useEditShift();
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('histories');

  return !readonly && shiftStatus === 'success' && shift ? (
    <div
      className={twMerge(
        'shadow-banner flex flex-col rounded-[1.25rem] bg-white',
        open && 'absolute right-5 bottom-5 h-[300%] max-h-[50vh]',
      )}
      style={{
        width: `${
          (shift.wardShiftTypes.filter((x) => x.isCounted).length + 1) * 2 + 1.25 + 1.25
        }rem`,
      }}
    >
      <div className="border-sub-4 font-apple flex h-10 w-full border-b-[.0313rem] text-base font-medium">
        <div
          className={`border-sub-4 flex h-10 flex-1 cursor-pointer items-center justify-center rounded-tl-[1.25rem] border-r-[.0313rem] ${currentTab === 'histories' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'}`}
          onClick={() => {
            setCurrentTab('histories');
            sendEvent(events.makePage.panel.changePanelTab, 'histories');
          }}
        >
          기록
        </div>
        <div
          className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-tr-[1.25rem] ${currentTab === 'faults' ? 'bg-main-4 text-sub-1' : 'bg-sub-5 text-sub-2.5'}`}
          onClick={() => {
            setCurrentTab('faults');
            sendEvent(events.makePage.panel.changePanelTab, 'faults');
          }}
        >
          <p className="relative">
            문제점
            <span className="bg-main-2 font-apple absolute top-0 right-0 flex h-[.875rem] w-[.875rem] translate-x-full items-center justify-center rounded-full text-[.625rem] text-white">
              {[...faults.values()].length}
            </span>
          </p>
        </div>
      </div>
      <div className="scrollbar-hide flex flex-1 flex-col overflow-y-scroll">
        {currentTab === 'faults'
          ? [...faults.values()].map((fault, index) => (
              <p
                key={index}
                className="border-sub-4 font-apple text-sub-2 cursor-pointer border-b-[.0313rem] px-[.8125rem] py-[.625rem] text-[.75rem] last:border-none"
                onClick={() => {
                  changeFocus(fault.focus);
                }}
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
                  className={`border-sub-4 font-apple flex cursor-pointer items-center gap-[.625rem] border-b-[.0313rem] px-[.8125rem] py-[.625rem] text-[.75rem] last:border-none ${
                    isPrev ? 'text-sub-3' : 'text-sub-2'
                  }`}
                  onClick={() => {
                    const diff = histories.history.length - index - 1 - histories.current;

                    sendEvent(
                      diff > 0
                        ? events.makePage.panel.redoBypanel
                        : events.makePage.panel.undoByPanel,
                    );
                    moveHistory(diff);
                  }}
                >
                  <p className="truncate">
                    {history.focus.shiftNurseName} / {history.focus.day + 1}일
                  </p>
                  <div className="bg-sub-3 h-full w-[.0313rem]" />
                  <p className="shrink-0">
                    {match(history)
                      .with(
                        { prevShiftType: null },
                        () => `추가 → ${history.nextShiftType?.shortName}`,
                      )
                      .with(
                        { nextShiftType: null },
                        () => `${history.prevShiftType?.shortName} → 삭제`,
                      )
                      .otherwise(
                        () =>
                          `${history.prevShiftType?.shortName} → ${history.nextShiftType?.shortName}`,
                      )}
                  </p>
                  {isPrev ? (
                    <RestoreIconDisable className="ml-auto h-4.5 w-4.5" />
                  ) : (
                    <RestoreIcon className="ml-auto h-4.5 w-4.5" />
                  )}
                </div>
              );
            })}
      </div>
      <div
        className="font-apple text-main-3 flex h-7.5 w-full cursor-pointer items-center justify-center text-[.625rem]"
        onClick={() => {
          setOpen(!open);
          sendEvent(open ? events.makePage.panel.foldPanel : events.makePage.panel.spreadPanel);
        }}
      >
        {open ? '닫기' : '펼치기'}
      </div>
    </div>
  ) : null;
}

export default Panel;
