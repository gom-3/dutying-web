import { shiftKindList, duty } from '@mocks/duty/data';
import './index.css';

const DutyCalendar = () => {
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
          {[row.user.name, row.carry].map((item, i) => (
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
};

const MakeDutyPage = () => {
  return (
    <div className="w-full flex-col items-center">
      <div className="w-[calc(100% - 32px)] flex h-[60px] gap-4 border-b-[1px] border-[#e0e0e0] bg-[#FFF] px-4 ">
        <div className="flex h-[60px] items-center justify-center text-xl font-bold text-[#333]">
          근무수
        </div>
        <div className="flex flex-1 items-center">
          <p>도움말</p>
        </div>
        <div className="flex gap-4">
          <button className="my-[10px] h-[40px] w-[100px] cursor-pointer rounded  bg-[#fcd4fc] text-sm font-bold text-[#333]">
            Auto Fill
          </button>
          <button className="my-[10px] h-[40px] w-[100px] cursor-pointer rounded  bg-[#c6dbf0] text-sm font-bold text-[#333]">
            완료
          </button>
        </div>
      </div>
      <div className="flex">
        <DutyCalendar />
        <div>
          <div className="flex h-[60px] items-center bg-[#C1CFF5] pr-4">
            <div className="text-[#333} w-[40px]  flex-shrink-0 text-center text-base font-bold">
              D
            </div>
            <div className="text-[#333} w-[40px]  flex-shrink-0 text-center text-base font-bold">
              E
            </div>
            <div className="text-[#333} w-[40px]  flex-shrink-0 text-center text-base font-bold">
              N
            </div>
            <div className="text-[#333} w-[40px]  flex-shrink-0 text-center text-base font-bold">
              O
            </div>
            <div className="text-[#333} w-[40px]  flex-shrink-0 text-center text-base font-bold">
              WO
            </div>
          </div>
          {duty.dutyRows.map((row) => (
            <div className="flex h-[50px] border-b-[1px] border-[#E0E0E0]">
              <div className="flex h-full w-[40px] items-center justify-center">
                {row.shiftList.filter((shiftId) => shiftId === 1).length}
              </div>
              <div className="flex h-full w-[40px] items-center justify-center">
                {row.shiftList.filter((shiftId) => shiftId === 2).length}
              </div>
              <div className="flex h-full w-[40px] items-center justify-center">
                {row.shiftList.filter((shiftId) => shiftId === 3).length}
              </div>
              <div className="flex h-full w-[40px] items-center justify-center">
                {row.shiftList.filter((shiftId) => shiftId === 0).length}
              </div>
              <div className="flex h-full w-[40px] items-center justify-center">
                {
                  row.shiftList.filter(
                    (shiftId, i) =>
                      shiftId === 0 && duty.days.find((x) => x.day === i + 1)?.dayKind != 'workday'
                  ).length
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[1414px]">
        <div className="w-[1198px]">
          {shiftKindList
            .filter((shift) => shift.name != '/')
            .map((shift) => (
              <div className="flex h-[50px] items-center justify-center gap-3 border-b-[1px] border-[#E0E0E0] px-4">
                <div className="text-[#333} w-[40px] text-center text-sm font-bold">
                  {shift.fullname}
                </div>
                <div className="text-[#333} w-[40px] text-center text-sm font-bold">
                  {shift.name}
                </div>
                <div className="flex">
                  {duty.lastDays.map((_date, i) => (
                    <p
                      key={i}
                      className="m-[2px] flex h-[26px] w-[26px] items-center justify-center text-center text-sm font-bold"
                    >
                      {duty.dutyRows.filter((item) => item.shiftList[i] === shift.id).length}
                    </p>
                  ))}
                </div>
                <div className="flex">
                  {duty.days.map((_date, i) => (
                    <p
                      key={i}
                      className="m-[2px] flex h-[26px] w-[26px] items-center justify-center text-center text-sm font-bold"
                    >
                      {duty.dutyRows.filter((item) => item.shiftList[i] === shift.id).length}
                    </p>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MakeDutyPage;
