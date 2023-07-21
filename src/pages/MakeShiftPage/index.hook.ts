/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { koToEn } from '@libs/util/koToEn';
import { getShift, updateShift } from '@libs/api/shift';
import { useAccount } from 'store';

const checkFaultOptions: CheckFaultOptions = {
  twoOffAfterNight: {
    isActive: true,
    regExp: /2([01]|3[012])/g,
    message: '나이트 근무 후 2일 이상 OFF를 권장합니다.',
    type: 'wrong',
  },
  ed: {
    isActive: true,
    regExp: /10/g,
    message: 'E 근무 후 D 근무는 권장되지 않습니다.',
    type: 'wrong',
  },
  maxContinuousWork: {
    isActive: true,
    regExp: /(?<=[^012])[012]{6,}(?=[^012])/g,
    message: '근무는 연속 5일을 초과할 수 없습니다.',
    type: 'wrong',
  },
  maxContinuousNight: {
    isActive: true,
    regExp: /2222+/g,
    message: '나이트 근무가 연속 3일을 초과했습니다',
    type: 'wrong',
  },
  minNightInterval: {
    isActive: true,
    regExp: /2[^2]{1,6}2/g,
    message: '나이트 간격이 최소 7일 이상이어야 합니다.',
    type: 'wrong',
  },
  singleNight: {
    isActive: true,
    regExp: /(?<!2)2(?!2)/g,
    message: '단일 나이트 근무는 권장되지 않습니다.',
    type: 'bad',
  },
  maxContinuousOff: {
    isActive: true,
    regExp: /3333+/g,
    message: 'OFF가 연속 3일을 초과했습니다.',
    type: 'bad',
  },
  pongdang: {
    isActive: true,
    regExp: /(3030|0303|1313|3131)/g,
    message: '퐁당퐁당 근무입니다.',
    type: 'bad',
  },
  noeeod: {
    isActive: true,
    regExp: /130/g,
    message: 'EOD 형태의 근무는 권장되지 않습니다.',
    type: 'bad',
  },
};

const useMakeShiftPageHook: MakeShiftPageHook = () => {
  const [year, _] = useState(new Date().getFullYear());
  // const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(7);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo, setFocusedDayInfo] = useState<DayInfo | null>(null);
  const [foldedLevels, setFoldedLevels] = useState<boolean[] | null>(null);
  const [histories, setHistories] = useState<EditHistory[]>([]);
  const [faults, setFaults] = useState<Map<string, Fault>>(new Map());
  const [isNurseTabOpen, setIsNurseTabOpen] = useState(false);

  const { account } = useAccount();

  const queryClient = useQueryClient();

  const shiftQueryKey = ['shift', account.wardId, year, month];
  const { data: shift, status: shiftStatus } = useQuery(
    shiftQueryKey,
    () => getShift(account.wardId, year, month),
    {
      onSuccess: (data) => setFoldedLevels(data.levelNurses.map(() => false)),
    }
  );
  const { mutate: focusedShiftChange, status: changeStatus } = useMutation(
    ({ shift, focus, shiftTypeId }: { shift: Shift; focus: Focus; shiftTypeId: number | null }) => {
      return updateShift(
        year,
        month,
        shift.days[focus.day].day,
        shift.levelNurses[focus.level][focus.row].nurse.nurseId,
        shiftTypeId
      );
    },
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['shift']);
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);

        if (!oldShift) return;
        const oldShiftTypeIndex =
          oldShift.levelNurses[focus.level][focus.row].shiftTypeIndexList[focus.day].shift;

        const history: EditHistory = {
          nurse: oldShift.levelNurses[focus.level][focus.row].nurse,
          focus,
          prevShiftType: oldShiftTypeIndex !== null ? oldShift.shiftTypes[oldShiftTypeIndex] : null,
          nextShiftType: oldShift.shiftTypes.find((x) => x.shiftTypeId === shiftTypeId) || null,
          dateString: new Date().toLocaleString(),
        };
        setHistories([...histories, history]);

        const newShiftTypeIndex = oldShift.shiftTypes.findIndex(
          (x) => x.shiftTypeId === shiftTypeId
        );

        queryClient.setQueryData<Shift>(shiftQueryKey, {
          ...oldShift,
          levelNurses: oldShift.levelNurses.map((rows, level) =>
            rows.map((row, index) =>
              focus.row === index && focus.level === level
                ? {
                    ...row,
                    shiftTypeIndexList: row.shiftTypeIndexList.map((oldShiftTypeIndex, day) =>
                      day === focus.day
                        ? {
                            ...oldShiftTypeIndex,
                            shift: newShiftTypeIndex === undefined ? null : newShiftTypeIndex,
                          }
                        : oldShiftTypeIndex
                    ),
                  }
                : row
            )
          ),
        });

        return { oldShift, history };
      },
      onError: (_, __, context) => {
        if (
          context === undefined ||
          context.oldShift === undefined ||
          context.history === undefined
        )
          return;
        console.log('error');
        queryClient.setQueryData(['shift'], context.oldShift);
        setHistories(histories.filter((history) => history !== context.history));
      },
    }
  );

  const checkShift = () => {
    const newFaults: Map<string, Fault> = new Map();
    if (shift === undefined) return;

    for (let i = 0; i < shift.levelNurses.length; i++) {
      const level = shift.levelNurses[i];
      for (let j = 0; j < level.length; j++) {
        const row = level[j];
        for (const key of Object.keys(checkFaultOptions) as FaultType[]) {
          const option = checkFaultOptions[key];
          const str = row.shiftTypeIndexList
            .map((x) => (x.shift === null ? 'x' : x.shift))
            .join('');
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const match = option.regExp.exec(str);
            if (match === null) break;
            const focus = { level: i, row: j, day: match.index };

            newFaults.set(Object.values(focus).join(), {
              type: option.type,
              faultType: key,
              nurse: row.nurse,
              focus,
              message: option.message,
              matchString: match[0]
                .split('')
                .map((x) => (x === 'x' ? '-' : shift.shiftTypes[Number(x)].shortName))
                .map((x) => (x === '/' ? 'O' : x))
                .join(''),
              length: match[0].length,
            });
          }
        }
      }
    }

    setFaults(newFaults);
  };

  const changeMonth: MakeShiftPageActions['changeMonth'] = (type) => {
    if (type === 'prev') {
      // if (month === 1) {
      //   setMonth(12);
      //   setYear(year - 1);
      // } else {
      //   setMonth(month - 1);
      // }
      setMonth(7);
    } else if (type === 'next') {
      // if (month === 12) {
      //   setMonth(1);
      //   setYear(year + 1);
      // } else {
      //   setMonth(month + 1);
      // }
      setMonth(8);
    }
  };

  const changeFocusedShift = (shiftTypeId: number | null) => {
    if (
      !focus ||
      !shift ||
      shift.levelNurses[focus.level][focus.row].shiftTypeIndexList[focus.day].shift ===
        shift.shiftTypes.findIndex((x) => x.shiftTypeId === shiftTypeId)
    )
      return;
    focusedShiftChange({ shift, focus, shiftTypeId });
  };

  const foldLevel = (level: Nurse['level']) => {
    if (!shift || !foldedLevels) return;
    setFoldedLevels(foldedLevels.map((x, index) => (index === level ? !x : x)));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!shift) return;

    if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
      e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
    }

    if (focus === null) return;

    const { level, day, row } = focus;
    const rows = shift.levelNurses[level];
    let newLevel = level;
    let newDay = day;
    let newRow = row;

    if (e.key === 'ArrowLeft') {
      if (day === 0) {
        if (row === 0) {
          newLevel = level === 0 ? shift.levelNurses.length - 1 : level - 1;
          newDay = shift.days.length - 1;
          newRow = shift.levelNurses[newLevel].length - 1;
        } else {
          newDay = shift.days.length - 1;
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
      if (day === shift.days.length - 1) {
        if (row === rows.length - 1) {
          newLevel = level === shift.levelNurses.length - 1 ? 0 : level + 1;
          newDay = 0;
          newRow = 0;
        } else {
          newRow = row + 1;
          newDay = 0;
        }
      } else {
        newDay =
          e.ctrlKey || e.metaKey ? shift.days.length - 1 : Math.min(shift.days.length - 1, day + 1);
        newRow = row;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow });
    }

    if (e.key === 'ArrowUp') {
      if (row === 0) {
        newLevel = level === 0 ? shift.levelNurses.length - 1 : level - 1;
        newDay = day;
        newRow = shift.levelNurses[newLevel].length - 1;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow });
    }

    if (e.key === 'ArrowDown') {
      if (row === rows.length - 1) {
        newLevel = level === shift.levelNurses.length - 1 ? 0 : level + 1;
        newDay = day;
        newRow = 0;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? rows.length - 1 : row + 1;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow });
    }

    // if (e.key === 'Space' || e.key === ' ') {
    //   setFocus({ ...focus, openTooltip: !focus.openTooltip });
    // }

    shift.shiftTypes.forEach((shiftType) => {
      if (shiftType.shortName.toUpperCase() === koToEn(e.key).toUpperCase() && focus) {
        changeFocusedShift(shiftType.shiftTypeId);
      }
    });

    if (e.key === 'Backspace') {
      changeFocusedShift(null);
    }
  };

  useEffect(() => {
    checkShift();
  }, [shift]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (shift && focus) {
      setFocusedDayInfo({
        month: month,
        day: focus.day ?? 0,
        countByShiftList: shift.shiftTypes.map((_, shiftTypeIndex) => ({
          count: shift.levelNurses
            .flatMap((row) => row)
            .filter((dutyRow) => dutyRow.shiftTypeIndexList[focus.day].shift === shiftTypeIndex)
            .length,
          shiftType: shift.shiftTypes[shiftTypeIndex],
        })),
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        nurse: shift.levelNurses.flatMap((row) => row).find((_, index) => index === focus.row)
          ?.nurse!,
        message: '3연속 N 근무 후 2일 이상 OFF를 권장합니다.',
      });
    } else {
      setFocusedDayInfo(null);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, shift]);

  return {
    state: {
      month,
      shift,
      focus,
      faults,
      histories,
      focusedDayInfo,
      foldedLevels,
      shiftStatus,
      changeStatus,
      isNurseTabOpen
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocusedShift,
      changeFocus: setFocus,
      setIsNurseTabOpen
    },
  };
};

export default useMakeShiftPageHook;
