import { useEffect, useRef, useState } from 'react';
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
  const [duty, setDuty] = useState<Duty>(dummyDuty);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo, setFocusedDayDuty] = useState<DayInfo | null>(null);
  const focusedCellRef = useRef<HTMLElement>(null);

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
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
          newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
          newRow = row;
        }
        setFocus({ day: newDay, row: newRow });
        break;
      case 'ArrowRight':
        if (day === duty.days.length - 1 && row < duty.dutyRows.length - 1) {
          newDay = 0;
          newRow = row + 1;
        } else {
          newDay =
            e.ctrlKey || e.metaKey ? duty.days.length - 1 : Math.min(duty.days.length - 1, day + 1);
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
          newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
        }
        setFocus({ day: newDay, row: newRow });
        break;
      case 'ArrowDown':
        if (row === duty.dutyRows.length - 1) {
          newDay = day;
          newRow = 0;
        } else {
          newDay = day;
          newRow = e.ctrlKey || e.metaKey ? duty.dutyRows.length - 1 : row + 1;
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
    if (focus) {
      const rect = focusedCellRef?.current!.getBoundingClientRect();
      console.log(rect);
      // 셀이 화면 오른쪽에 있을 때 오른쪽으로 충분히 화면을 이동한다.
      if (rect.x > window.innerWidth - rect.width)
        window.scroll({ left: rect.left + window.scrollX });
      // 셀이 화면 왼쪽에 있을 때 왼쪽 끝으로 화면을 이동한다.
      if (rect.x < 0) window.scroll({ left: 0 });
      if (rect.y > window.innerHeight - 150 - rect.height)
        // 셀이 화면 아래에 있을 때 아래로 충분히 화면을 이동한다.
        window.scroll({ top: rect.top + window.scrollY });
      // 셀이 화면 위에 있을 때 한칸씩 위로 화면을 이동한다.
      if (rect.y < 120) window.scroll({ top: rect.top + window.scrollY - 132 });

      setFocusedDayDuty({
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
      });
    } else {
      setFocusedDayDuty(null);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, duty]);

  return {
    /** 근무표 데이터 */
    duty,
    /** 현재 선택한 근무 셀 */
    focus,
    /** 현재 선택한 근무 셀의 정보 */
    focusedDayInfo,
    /** 선택 대상의 셀의 ref */
    focusedCellRef,
    /** 근무 유형 */
    shiftKindList,
    handlers: {
      /** 근무 셀 선택 */
      handleFocusChange: setFocus,
      /** 현재 선택한 근무의 값 변경 */
      handleFocusedDutyChange,
    },
  };
};

export default useEditDuty;
