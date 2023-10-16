import useEditShift from '@hooks/shift/useEditShift';

function CountDutyByDay() {
  const {
    state: { focus, shift },
  } = useEditShift();

  return (
    shift && (
      <div className="rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
        {shift.wardShiftTypes.map((wardShiftType, index) => (
          <div
            key={index}
            className="flex h-[2.5rem] items-center justify-center gap-[1.25rem] border-b-[.0625rem] border-[#E0E0E0] last:border-none"
          >
            <div
              className={`flex h-full w-[3.125rem] items-center justify-center font-poppins text-[1.5rem] 
            ${index === 0 && 'rounded-tl-[1.25rem]'} 
            ${index === shift.wardShiftTypes.length - 1 && 'rounded-bl-[1.25rem]'}
            `}
              style={{
                backgroundColor: wardShiftType.color,
                color: 'white',
              }}
            >
              {wardShiftType.shortName}
            </div>
            <div className="flex h-full px-[1rem] text-center">
              {shift.days.map((_date, i) => (
                <p
                  key={i}
                  className={`flex w-[2.25rem] flex-1 items-center justify-center font-poppins text-[1.25rem] text-sub-2 ${
                    focus?.day === i && 'bg-main-4'
                  }`}
                >
                  {
                    shift.divisionShiftNurses
                      .flatMap((rows) => rows)
                      .filter((row) => row.wardShiftList[i] === wardShiftType.wardShiftTypeId)
                      .length
                  }
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
