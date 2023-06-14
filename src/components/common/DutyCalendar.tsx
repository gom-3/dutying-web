interface Props {
  duty: Duty;
  shiftKindList: ShiftKind[];
  isEditable?: boolean;
}

export default function DutyCalendar({ duty, shiftKindList }: Props) {
  return (
    <div className="w-[1198px]">
      <div className="flex h-[60px] items-center justify-center gap-3 bg-[#c1cff5] px-4">
        <div className="w-[40px] flex-shrink-0 text-center text-sm font-bold text-[#333] ">
          이름
        </div>
        <div className="w-[40px] flex-shrink-0 text-center text-sm font-bold text-[#333] ">
          이월
        </div>
        {[duty.lastDays, duty.days].map((days, i) => (
          <div className=" h-full flex-col justify-evenly text-center">
            <div className="text-xl">{duty.month - 1 + i}월</div>
            <div className="flex justify-center">
              {days.map((item, j) => (
                <div
                  key={j}
                  className={`flex w-[30px] items-center justify-center text-xs font-bold  ${
                    item.dayKind === 'workday'
                      ? 'text-[#333]'
                      : item.dayKind === 'saturday'
                      ? 'text-[#00f]'
                      : 'text-[#f00]'
                  }`}
                >
                  {duty.month - 1 + i}/{item.day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {duty.dutyRows.map((row) => (
        <div className="flex h-[50px] items-center justify-center gap-3 border-b-[1px] border-[#e0e0e0] px-4">
          {[row.user.name, row.carry].map((item) => (
            <p className="w-[40px] flex-shrink-0 text-center text-sm font-bold text-[#333]">
              {item}
            </p>
          ))}
          {[row.lastShiftList, row.shiftList].map((shiftList) => (
            <div className="flex">
              {shiftList.map((shiftId, i) => (
                <div
                  key={i}
                  className={`m-[2px] flex h-[26px] w-[26px] cursor-pointer items-center justify-center bg-[#E2E1E1] ${
                    shiftKindList[shiftId].name === 'D'
                      ? 'bg-[#ffcd95]'
                      : shiftKindList[shiftId].name === 'E'
                      ? 'bg-[#e0e8f3]'
                      : shiftKindList[shiftId].name === 'N'
                      ? 'bg-[#ebdeff]'
                      : 'bg-[#cbcbcb]'
                  }`}
                >
                  {shiftKindList[shiftId].name}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
