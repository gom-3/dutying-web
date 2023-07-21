import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRequestShift } from '@libs/api/shift';
import { useAccount } from 'store';

const useRequestShiftPageHook: RequestShiftPageHook = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(6);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [foldedLevels, setFoldedLevels] = useState<boolean[] | null>(null);
  const { account } = useAccount();

  const requestShiftQueryKey = ['requestShift', account.nurseId, year, month];
  const { data: requestShift } = useQuery(
    requestShiftQueryKey,
    () => getRequestShift(account.nurseId, year, month),
    {
      onSuccess: (data) => setFoldedLevels(data.levelNurses.map(() => false)),
    }
  );

  const foldLevel = (level: Nurse['level']) => {
    if (!requestShift || !foldedLevels) return;

    setFoldedLevels(
      foldedLevels.map((isFolded, index) =>
        index === requestShift.levelNurses.length - level ? !isFolded : isFolded
      )
    );
  };

  const changeMonth: MakeShiftPageActions['changeMonth'] = (type) => {
    if (type === 'prev') {
      if (month === 1) {
        setMonth(12);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else if (type === 'next') {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!requestShift) return;

    if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
      e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
    }

    if (focus === null) return;

    const { level, day, row } = focus;
    const rows = requestShift.levelNurses[level];
    let newLevel = level;
    let newDay = day;
    let newRow = row;

    if (e.key === 'ArrowLeft') {
      if (day === 0) {
        if (row === 0) {
          newLevel = level === 0 ? requestShift.levelNurses.length - 1 : level - 1;
          newDay = requestShift.days.length - 1;
          newRow = requestShift.levelNurses[newLevel].length - 1;
        } else {
          newDay = requestShift.days.length - 1;
          newRow = row - 1;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
        newRow = row;
      }
      setFocus({
        level: newLevel,
        day: newDay,
        row: newRow,
      });
    }
    if (e.key === 'ArrowRight') {
      if (day === requestShift.days.length - 1) {
        if (row === rows.length - 1) {
          newLevel = level === requestShift.levelNurses.length - 1 ? 0 : level + 1;
          newDay = 0;
          newRow = 0;
        } else {
          newRow = row + 1;
          newDay = 0;
        }
      } else {
        newDay =
          e.ctrlKey || e.metaKey
            ? requestShift.days.length - 1
            : Math.min(requestShift.days.length - 1, day + 1);
        newRow = row;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow });
    }

    if (e.key === 'ArrowUp') {
      if (row === 0) {
        newLevel = level === 0 ? requestShift.levelNurses.length - 1 : level - 1;
        newDay = day;
        newRow = requestShift.levelNurses[newLevel].length - 1;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow });
    }

    if (e.key === 'ArrowDown') {
      if (row === rows.length - 1) {
        newLevel = level === requestShift.levelNurses.length - 1 ? 0 : level + 1;
        newDay = day;
        newRow = 0;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? rows.length - 1 : row + 1;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, requestShift]);

  return {
    state: {
      month,
      requestShift,
      focus,
      foldedLevels,
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocus: setFocus,
    },
  };
};

export default useRequestShiftPageHook;
