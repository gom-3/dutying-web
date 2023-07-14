import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import useEditDuty from '@pages/MakeShiftPage/components/useEditDuty';
import ShiftCalendar from './components/ShiftCalendar';

const MakeShiftPage = () => {
  const {
    shift,
    focus,
    rowContainerRef,
    foldedProficiency,
    shiftTypeList,
    focusedCellRef,
    handlers,
  } = useEditDuty();

  return (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar shift={shift} />
      <ShiftCalendar
        shift={shift}
        shiftTypeList={shiftTypeList}
        isEditable
        focus={focus}
        foldedProficiency={foldedProficiency}
        focusedCellRef={focusedCellRef}
        rowContainerRef={rowContainerRef}
        handleFocusChange={handlers.handleFocusChange}
        handleFold={handlers.handleFold}
      />
      <div className="sticky bottom-0 flex h-[15.625rem] justify-end gap-[1.25rem] bg-[#FDFCFE]">
        <CountDutyByDay focus={focus} shift={shift} shiftTypeList={shiftTypeList} />
        <div className="mb-[3.125rem] mt-[1.25rem] w-[13.625rem] rounded-[1.25rem] bg-main-4 px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]"></div>
      </div>
      {/* 
      오버레이 코드가 알파버전 제외로 주석처리 합니다.
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
              ].map((shiftType, i) => (
                <div key={i} className="flex h-[3.3125rem]">
                  <p className="font-poppins text-[.75rem] text-sub-2.5">
                    {shiftType.count}/{shiftType.standard}
                  </p>
                  <ShiftBadge
                    shiftType={shiftType.shiftType}
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
      )} */}
    </div>
  );
};

export default MakeShiftPage;
