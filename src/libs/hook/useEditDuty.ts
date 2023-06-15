import { RefObject, useEffect, useState } from 'react';
import { shiftKindList, duty as dummyDuty, dutyConstraint } from '@mocks/duty/data';

export type Focus = {
  day: number;
  row: number;
};

export type DayInfo = {
  /** @example D E N O가 각각 1, 2, 3, 4 이면 [4, 1, 2, 3] */
  shiftList: { count: number; standard: number }[];
  month: number;
  day: number;
  nurse: Nurse;
};

const useEditDuty = () => {
  const [duty, setDuty] = useState(dummyDuty);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo, setFocusedDayDuty] = useState<DayInfo | null>(null);

  // Focus된 셀의 근무를 ShiftId를 통해 변경
  const handleFocusedDutyChange = (shiftId: number) => {
    if (focus === null) return;

    setDuty((duty) => ({
      ...duty,
      dutyRows: duty.dutyRows.map((dutyRow, index) =>
        focus.row === index
          ? {
              ...dutyRow,
              shiftList: dutyRow.shiftList.map((shift, day) =>
                day === focus.day ? shiftId : shift
              ),
            }
          : dutyRow
      ),
    }));
  };

  const handleFocusChange = (ref: RefObject<HTMLElement>, focus: Focus | null) => {
    ref.current?.focus();
    setFocus(focus);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
      e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
    }

    if (focus === null) return;

    const { day, row } = focus;
    let newDay, newRow;

    switch (e.key) {
      case 'ArrowLeft':
        if (day === 0 && row > 0) {
          newDay = duty.days.length - 1;
          newRow = row - 1;
        } else {
          newDay = Math.max(0, day - 1);
          newRow = row;
        }
        setFocus({ day: newDay, row: newRow });
        break;
      case 'ArrowRight':
        if (day === duty.days.length - 1 && row < duty.dutyRows.length - 1) {
          newDay = 0;
          newRow = row + 1;
        } else {
          newDay = Math.min(duty.days.length - 1, day + 1);
          newRow = row;
        }
        setFocus({ day: newDay, row: newRow });
        break;
      case 'ArrowUp':
        if (row === 0) {
          newDay = day;
          newRow = duty.dutyRows.length - 1;
        } else {
          newDay = day;
          newRow = row - 1;
        }
        setFocus({ day: newDay, row: newRow });
        break;
      case 'ArrowDown':
        if (row === duty.dutyRows.length - 1) {
          newDay = day;
          newRow = 0;
        } else {
          newDay = day;
          newRow = row + 1;
        }
        setFocus({ day: newDay, row: newRow });
        break;
      case '0':
      case 'O':
      case 'o':
      case '/':
        handleFocusedDutyChange(0);
        break;
      case '1':
      case 'D':
      case 'd':
      case 'ㅇ':
        handleFocusedDutyChange(1);
        break;
      case '2':
      case 'E':
      case 'e':
      case 'ㄷ':
        handleFocusedDutyChange(2);
        break;
      case '3':
      case 'N':
      case 'n':
      case 'ㅜ':
        handleFocusedDutyChange(3);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    focus
      ? setFocusedDayDuty({
          month: duty.month,
          day: focus.day ?? 0,
          shiftList: shiftKindList.map((_, shiftIndex) => ({
            count: duty.dutyRows.filter((dutyRow) => dutyRow.shiftList[focus.day] === shiftIndex)
              .length,
            standard:
              duty.days[focus.day].dayKind === 'workday'
                ? dutyConstraint.dutyStandard.workday[shiftIndex]
                : dutyConstraint.dutyStandard.weekend[shiftIndex],
          })),
          nurse: duty.dutyRows.find((_, index) => index === focus.row)?.user!,
        })
      : setFocusedDayDuty(null);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, duty]);

  return { duty, focus, shiftKindList, focusedDayInfo, handleFocusChange, handleFocusedDutyChange };
};

export default useEditDuty;
