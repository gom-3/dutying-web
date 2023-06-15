import { useEffect, useState } from 'react';
import { shiftKindList, duty as dummyDuty } from '@mocks/duty/data';

const useEditDuty = () => {
  const [duty, setDuty] = useState(dummyDuty);
  const [focus, setFocus] = useState<Focus>({ day: null, row: null });

  const handleFocusedDutyChange = (shiftId: number) => {
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
    const { day, row } = focus;
    let newDay, newRow;

    if (day === null || row === null) return;

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
        handleFocusedDutyChange(1);
        break;
      case '2':
      case 'E':
      case 'e':
        handleFocusedDutyChange(2);
        break;
      case '3':
      case 'N':
      case 'n':
        handleFocusedDutyChange(3);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus]);

  return { duty, focus, setFocus, shiftKindList };
};

export default useEditDuty;
