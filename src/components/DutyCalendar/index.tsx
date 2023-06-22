import { Focus } from '@libs/hook/useEditDuty';
import { RefObject } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

interface Props {
  duty: Duty;
  shiftList: ShiftList;
  isEditable?: boolean;
  focus?: Focus | null;
  focusedCellRef: RefObject<HTMLElement>;
  handleFocusChange?: (focus: Focus | null) => void;
}

export default function DutyCalendar({
  duty,
  shiftList,
  isEditable,
  focus,
  focusedCellRef,
  handleFocusChange,
}: Props) {
  const clickAwayRef = useOnclickOutside(() => isEditable && handleFocusChange?.(null));

  return (
    <table ref={clickAwayRef}>
      <thead className="sticky top-[60px]">
        <tr className="flex h-[60px] items-center justify-center gap-3 bg-[#c1cff5] px-4">
          <th className="w-[40px] shrink-0 text-center text-sm font-bold text-[#333] ">이름</th>
          <th className="w-[40px] shrink-0 text-center text-sm font-bold text-[#333] ">이월</th>
          {[duty.lastDays, duty.days].map((days, i) => (
            <th key={i} className="flex h-full flex-col justify-evenly text-center">
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
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {duty.dutyRows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="flex h-[50px] items-center justify-center gap-3 border-b-[1px] border-[#e0e0e0] px-4"
          >
            {[row.user.name, row.carry].map((item, i) => (
              <td key={i} className="w-[40px] shrink-0 text-center text-sm font-bold text-[#333]">
                {item}
              </td>
            ))}
            {[row.lastShiftIndexList, row.shiftIndexList].map((shiftIndexList, index) => (
              <td key={index} className="flex">
                {shiftIndexList.map((shiftIndex, j) => {
                  const isFocued = index == 1 && focus && focus.day === j && focus.row === rowIndex;
                  return (
                    <p
                      ref={
                        isFocued
                          ? (focusedCellRef as unknown as RefObject<HTMLParagraphElement>)
                          : null
                      }
                      key={j}
                      onClick={() => {
                        index == 1 && handleFocusChange?.({ day: j, row: rowIndex });
                      }}
                      className={`m-[2px] h-[26px] w-[26px] cursor-pointer bg-[#E2E1E1] text-center text-base leading-[30px]
                  ${isFocued && 'outline outline-2 outline-[#333]'}
                  ${
                    shiftList[shiftIndex].name === 'D'
                      ? 'bg-[#ffcd95]'
                      : shiftList[shiftIndex].name === 'E'
                      ? 'bg-[#e0e8f3]'
                      : shiftList[shiftIndex].name === 'N'
                      ? 'bg-[#ebdeff]'
                      : 'bg-[#cbcbcb]'
                  }`}
                    >
                      {shiftList[shiftIndex].name}
                    </p>
                  );
                })}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
