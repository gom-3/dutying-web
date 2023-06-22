import { DayInfo } from '@libs/hook/useEditDuty';

interface Props {
  shiftList: ShiftList;
  focusedDayInfo: DayInfo | null;
  handleFocusedDutyChange: (shiftId: number) => void;
}

function Toolbar({ shiftList, focusedDayInfo, handleFocusedDutyChange }: Props) {
  return (
    <div className="sticky top-0 flex h-[60px] w-full gap-4 border-b-[1px] border-[#e0e0e0] bg-[#FFF] px-4 ">
      {focusedDayInfo && (
        <div className="flex h-[60px] flex-col items-center justify-center">
          <p className="font-bold">
            {focusedDayInfo.month}월 {focusedDayInfo.day + 1}일
          </p>
          <p className="text-xs text-[#333]">{focusedDayInfo.nurse.name}</p>
        </div>
      )}
      {focusedDayInfo &&
        shiftList.map((shiftKine, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              onClick={() => handleFocusedDutyChange(i)}
              className={`ignore-onclickoutside flex h-[30px] w-[30px] cursor-pointer items-center justify-center text-lg font-bold text-[#333]
            ${
              shiftList[i].name === 'D'
                ? 'bg-[#ffcd95]'
                : shiftList[i].name === 'E'
                ? 'bg-[#e0e8f3]'
                : shiftList[i].name === 'N'
                ? 'bg-[#ebdeff]'
                : 'bg-[#cbcbcb]'
            }
            `}
            >
              {shiftKine.name}
            </div>
            <p className="text-base text-[#333]">
              {focusedDayInfo?.countByShiftList[i].count}/
              {focusedDayInfo?.countByShiftList[i].standard}
            </p>
          </div>
        ))}

      <div className="flex flex-1 items-center">{/* <p>도움말</p> */}</div>
      <div className="flex gap-4">
        <button className="my-[10px] h-[40px] w-[100px] cursor-pointer rounded  bg-[#fcd4fc] text-sm font-bold text-[#333]">
          Auto Fill
        </button>
        <button className="my-[10px] h-[40px] w-[100px] cursor-pointer rounded  bg-[#c6dbf0] text-sm font-bold text-[#333]">
          완료
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
