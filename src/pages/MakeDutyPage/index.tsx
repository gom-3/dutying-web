import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import useEditDuty from '@pages/MakeDutyPage/components/useEditDuty';
import DutyCalendar from './components/DutyCalendar';
import ShiftBadge from '@components/ShiftBadge';

const MakeDutyPage = () => {
  const {
    duty,
    focus,
    focusedDayInfo,
    rowContainerRef,
    foldedProficiency,
    shiftList,
    focusedCellRef,
    handlers,
  } = useEditDuty();

  return (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar duty={duty} />
      <DutyCalendar
        duty={duty}
        shiftList={shiftList}
        isEditable
        focus={focus}
        foldedProficiency={foldedProficiency}
        focusedCellRef={focusedCellRef}
        rowContainerRef={rowContainerRef}
        handleFocusChange={handlers.handleFocusChange}
        handleFold={handlers.handleFold}
      />
      <div className="sticky bottom-0 flex h-[15.625rem] justify-end gap-[1.25rem] bg-[#FDFCFE]">
        <CountDutyByDay focus={focus} duty={duty} shiftList={shiftList} />
        <div className="mb-[3.125rem] mt-[1.25rem] w-[13.625rem] rounded-[1.25rem] bg-main-4 px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]"></div>
      </div>
      {focus?.openTooltip && focusedDayInfo && (
        <div
          className="absolute z-20 flex flex-col items-center"
          style={{
            top: focusedDayInfo.tooltipTop,
            left: focusedDayInfo.tooltipLeft,
            transform: `translate(-50%)`,
          }}
        >
          <div className="h-[1.125rem] w-[.0625rem] bg-main-1" />
          <div
            className="flex h-[7.1875rem]
        w-[20.8125rem] flex-col justify-between rounded-[.9375rem] border-[.0938rem] border-main-1 bg-[#fffffff2] px-[1.3125rem] py-[.875rem] shadow-shadow-2"
          >
            <div className="flex justify-between">
              {[
                ...focusedDayInfo.countByShiftList.slice(1),
                focusedDayInfo?.countByShiftList[0],
              ].map((shift) => (
                <div className="flex h-[3.3125rem]">
                  <p className="font-poppins text-[.75rem] text-sub-2.5">
                    {shift.count}/{shift.standard}
                  </p>
                  <ShiftBadge
                    shift={shift.shift}
                    className="h-[2.625rem] w-[2.625rem] self-end text-[1.875rem]"
                  />
                </div>
              ))}
            </div>
            <p className="text-center font-poppins text-[.75rem] text-main-1">
              {focusedDayInfo.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeDutyPage;
