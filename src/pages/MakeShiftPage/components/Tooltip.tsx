import ShiftBadge from '@components/ShiftBadge';

interface Props {
  focusedDayInfo: DayInfo;
}
function Tooltip({ focusedDayInfo }: Props) {
  return (
    <div
      className="absolute z-20 flex flex-col items-center"
      style={{
        transform: `translate(-50%)`,
      }}
    >
      <div className="h-[1.125rem] w-[.0625rem] bg-main-1" />
      <div
        className="flex h-[7.1875rem]
        w-[20.8125rem] flex-col justify-between rounded-[.9375rem] border-[.0938rem] border-main-1 bg-[#fffffff2] px-[1.3125rem] py-[.875rem] shadow-shadow-2"
      >
        <div className="flex justify-between">
          {[...focusedDayInfo.countByShiftList.slice(1), focusedDayInfo?.countByShiftList[0]].map(
            (shiftType, i) => (
              <div key={i} className="flex h-[3.3125rem]">
                <p className="font-poppins text-[.75rem] text-sub-2.5">{shiftType.count}</p>
                <ShiftBadge
                  shiftType={shiftType.shiftType}
                  className="h-[2.625rem] w-[2.625rem] self-end text-[1.875rem]"
                />
              </div>
            )
          )}
        </div>
        <p className="text-center font-poppins text-[.75rem] text-main-1">
          {focusedDayInfo.message}
        </p>
      </div>
    </div>
  );
}

export default Tooltip;
