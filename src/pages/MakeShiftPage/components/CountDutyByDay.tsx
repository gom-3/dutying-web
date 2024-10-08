import useEditShift from '@hooks/shift/useEditShift';
import useUIConfig from '@hooks/ui/useUIConfig';

function CountDutyByDay() {
  const {
    state: { focus, shift },
  } = useEditShift();
  const {
    state: { shiftTypeColorStyle },
  } = useUIConfig();

  return (
    shift && (
      <div id="count_by_day" className="rounded-[1.25rem] bg-main-bg shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
        {shift.wardShiftTypes
          .filter((x) => x.isCounted)
          .map((wardShiftType, index) => (
            <div key={index} className="flex h-10 items-center justify-center gap-5 border-b-[.0625rem] border-[#E0E0E0] last:border-none">
              <div
                className={`flex h-full w-[3.125rem] items-center justify-center font-poppins text-[1.5rem] 
            ${index === 0 && 'rounded-tl-[1.25rem]'} 
            ${index === shift.wardShiftTypes.filter((x) => x.isCounted).length - 1 && 'rounded-bl-[1.25rem]'}
            `}
                style={
                  shiftTypeColorStyle === 'background'
                    ? { backgroundColor: wardShiftType.color, color: 'white' }
                    : { color: wardShiftType.color, backgroundColor: 'white' }
                }
              >
                {wardShiftType.shortName}
              </div>
              <div className="flex h-full px-4 text-center">
                {shift.days.map((_date, i) => (
                  <p
                    key={i}
                    className={`flex w-9 flex-1 items-center justify-center font-poppins text-[1.25rem] text-sub-2 ${focus?.day === i && 'bg-main-4'}`}
                  >
                    {shift.divisionShiftNurses.flatMap((rows) => rows).filter((row) => row.wardShiftList[i] === wardShiftType.wardShiftTypeId).length}
                  </p>
                ))}
              </div>
            </div>
          ))}
      </div>
    )
  );
}

export default CountDutyByDay;
