import ShiftBadge from '@/components/ShiftBadge';
import { type DayInfo } from '@/hooks/shift/useEditShift/types';

interface Props {
  focusedDayInfo: DayInfo;
}

function Overay({ focusedDayInfo }: Props) {
  return (
    <div
      className="absolute z-20 flex flex-col items-center"
      style={{
        transform: `translate(-50%)`,
      }}
    >
      <div className="bg-main-1 h-4.5 w-[.0625rem]" />
      <div className="border-main-1 shadow-shadow-2 flex h-28.75 w-83.25 flex-col justify-between rounded-[.9375rem] border-[.0938rem] bg-[#fffffff2] px-5.25 py-[.875rem]">
        <div className="flex justify-between">
          {[...focusedDayInfo.countByShiftList.slice(1), focusedDayInfo?.countByShiftList[0]].map(
            (shiftType, i) => (
              <div key={i} className="flex h-13.25">
                <p className="font-poppins text-sub-2.5 text-[.75rem]">{shiftType.count}</p>
                <ShiftBadge
                  shiftType={shiftType.shiftType}
                  className="h-10.5 w-10.5 self-end text-[1.875rem]"
                />
              </div>
            ),
          )}
        </div>
        <p className="font-poppins text-main-1 text-center text-[.75rem]">
          {focusedDayInfo.message}
        </p>
      </div>
    </div>
  );
}

export default Overay;
