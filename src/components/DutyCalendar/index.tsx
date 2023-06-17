import { Focus } from '@libs/hook/useEditDuty';
import { RefObject } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

interface Props {
  duty: Duty;
  shiftKindList: ShiftKind[];
  isEditable?: boolean;
  focus?: Focus | null;
  focusedCellRef: RefObject<HTMLElement>;
  handleFocusChange?: (focus: Focus | null) => void;
}

export default function DutyCalendar({
  duty,
  shiftKindList,
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
            {[row.lastShiftList, row.shiftList].map((shiftList, i) => (
              <td key={i} className="flex">
                {shiftList.map((shiftId, j) => {
                  const isFocued = i == 1 && focus && focus.day === j && focus.row === rowIndex;
                  return (
                    <p
                      ref={
                        isFocued
                          ? (focusedCellRef as unknown as RefObject<HTMLParagraphElement>)
                          : null
                      }
                      key={j}
                      onClick={() => {
                        i == 1 && handleFocusChange?.({ day: j, row: rowIndex });
                      }}
                      className={`m-[2px] h-[26px] w-[26px] cursor-pointer bg-[#E2E1E1] text-center text-base leading-[30px]
                  ${isFocued && 'outline outline-2 outline-[#333]'}
                  ${
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
