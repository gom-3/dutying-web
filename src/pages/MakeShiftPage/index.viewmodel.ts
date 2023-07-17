/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect } from 'react';
import { mockShift } from '@mocks/shift';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { koToEn } from '@libs/util/koToEn';

const shiftData = mockShift;

/**추후 서버 API로 대체 */
const getShiftApi = () => {
  return new Promise<Shift>((resolve) => {
    setTimeout(() => {
      resolve(shiftData);
    }, 500);
  });
};

const updateFocusedShiftApi = (focus: Focus, shiftTypeIndex: number | null) => {
  shiftData.levels[focus.level][focus.row].shiftTypeIndexList[focus.day].current = shiftTypeIndex;
  return new Promise<Shift>((resolve) => {
    setTimeout(() => {
      resolve(shiftData);
    }, 500);
  });
};

const checkFaultOptions: CheckFaultOptions = {
  twoOffAfterNight: {
    isActive: true,
    regExp: /3([12]|0[123])/g,
    message: '나이트 근무 후 2일 이상 OFF를 권장합니다.',
    type: 'wrong',
  },
  ed: {
    isActive: true,
    regExp: /21/g,
    message: 'E 근무 후 D 근무는 권장되지 않습니다.',
    type: 'wrong',
  },
  maxContinuousWork: {
    isActive: true,
    regExp: /(?<=[^123])[123]{6,}(?=[^123])/g,
    message: '근무는 연속 5일을 초과할 수 없습니다.',
    type: 'wrong',
  },
  maxContinuousNight: {
    isActive: true,
    regExp: /3333+/g,
    message: '나이트 근무가 연속 3일을 초과했습니다',
    type: 'wrong',
  },
  minNightInterval: {
    isActive: true,
    regExp: /3[^3]{1,6}3/g,
    message: '나이트 간격이 최소 7일 이상이어야 합니다.',
    type: 'wrong',
  },
  singleNight: {
    isActive: true,
    regExp: /(?<!3)3(?!3)/g,
    message: '단일 나이트 근무는 권장되지 않습니다.',
    type: 'bad',
  },
  maxContinuousOff: {
    isActive: true,
    regExp: /0000+/g,
    message: 'OFF가 연속 3일을 초과했습니다.',
    type: 'bad',
  },
  pongdang: {
    isActive: true,
    regExp: /(0101|1010|2020|0202)/g,
    message: '퐁당퐁당 근무입니다.',
    type: 'bad',
  },
  noeeod: {
    isActive: true,
    regExp: /201/g,
    message: 'EOD 형태의 근무는 권장되지 않습니다.',
    type: 'bad',
  },
};

const MakeShiftPageViewModel: MakeShiftPageViewModel = () => {
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo, setFocusedDayInfo] = useState<DayInfo | null>(null);
  const [foldedLevels, setFoldedLevels] = useState<boolean[] | null>(null);
  const [histories, setHistories] = useState<EditHistory[]>([]);
  const [faults, setFaults] = useState<Map<string, Fault>>(new Map());

  const queryClient = useQueryClient();
  const { data: shift, status: shiftStatus } = useQuery(['shift'], getShiftApi, {
    onSuccess: (data) => setFoldedLevels(data.levels.map(() => false)),
  });
  const { mutate: focusedShiftChange, status: changeStatus } = useMutation(
    ({ focus, shiftTypeIndex }: { focus: Focus; shiftTypeIndex: number | null }) =>
      updateFocusedShiftApi(focus, shiftTypeIndex),
    {
      onMutate: async ({ focus, shiftTypeIndex }) => {
        await queryClient.cancelQueries(['shift']);
        const oldShift = queryClient.getQueryData<Shift>(['shift']);

        if (!oldShift) return;
        const oldShiftTypeIndex =
          oldShift.levels[focus.level][focus.row].shiftTypeIndexList[focus.day].current;

        const history: EditHistory = {
          nurse: oldShift.levels[focus.level][focus.row].nurse,
          focus,
          prevShiftType:
            oldShiftTypeIndex !== null ? oldShift.shiftTypeList[oldShiftTypeIndex] : null,
          nextShiftType: shiftTypeIndex !== null ? oldShift.shiftTypeList[shiftTypeIndex] : null,
          dateString: new Date().toLocaleString(),
        };
        setHistories([...histories, history]);

        queryClient.setQueryData<Shift>(['shift'], {
          ...oldShift,
          levels: oldShift.levels.map((rows, level) =>
            rows.map((row, index) =>
              focus.row === index && focus.level === level
                ? {
                    ...row,
                    shiftTypeIndexList: row.shiftTypeIndexList.map((oldShiftTypeIndex, day) =>
                      day === focus.day
                        ? { ...oldShiftTypeIndex, current: shiftTypeIndex }
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
        queryClient.setQueryData(['shift'], context.oldShift);
        setHistories(histories.filter((history) => history !== context.history));
      },
    }
  );

  const checkShift = () => {
    const newFaults: Map<string, Fault> = new Map();
    if (shift === undefined) return;

    for (let i = 0; i < shift.levels.length; i++) {
      const level = shift.levels[i];
      for (let j = 0; j < level.length; j++) {
        const row = level[j];
        for (const key of Object.keys(checkFaultOptions) as FaultType[]) {
          const option = checkFaultOptions[key];
          const str = row.shiftTypeIndexList
            .map((x) => (x.current === null ? 'x' : x.current))
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
                .map((x) => (x === 'x' ? '-' : shift.shiftTypeList[Number(x)].shortName))
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

  const changeFocusedShift = (shiftTypeIndex: number | null) => {
    if (
      !focus ||
      !shift ||
      shift.levels[focus.level][focus.row].shiftTypeIndexList[focus.day].current === shiftTypeIndex
    )
      return;
    focusedShiftChange({ focus, shiftTypeIndex });
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
    const rows = shift.levels[level];
    let newLevel = level;
    let newDay = day;
    let newRow = row;

    if (e.key === 'ArrowLeft') {
      if (day === 0) {
        if (row === 0) {
          newLevel = level === 0 ? shift.levels.length - 1 : level - 1;
          newDay = shift.days.length - 1;
          newRow = shift.levels[newLevel].length - 1;
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
          newLevel = level === shift.levels.length - 1 ? 0 : level + 1;
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
        newLevel = level === 0 ? shift.levels.length - 1 : level - 1;
        newDay = day;
        newRow = shift.levels[newLevel].length - 1;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow });
    }

    if (e.key === 'ArrowDown') {
      if (row === rows.length - 1) {
        newLevel = level === shift.levels.length - 1 ? 0 : level + 1;
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

    shift.shiftTypeList.forEach((shiftType, index) => {
      if (shiftType.shortName.toUpperCase() === koToEn(e.key).toUpperCase() && focus) {
        changeFocusedShift(index);
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
        month: shift.month,
        day: focus.day ?? 0,
        countByShiftList: shift.shiftTypeList.map((_, shiftTypeIndex) => ({
          count: shift.levels
            .flatMap((row) => row)
            .filter((dutyRow) => dutyRow.shiftTypeIndexList[focus.day].current === shiftTypeIndex)
            .length,
          shiftType: shift.shiftTypeList[shiftTypeIndex],
        })),
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        nurse: shift.levels.flatMap((row) => row).find((_, index) => index === focus.row)?.nurse!,
        message: '3연속 N 근무 후 2일 이상 OFF를 권장합니다.',
      });
    } else {
      setFocusedDayInfo(null);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, shift]);

  useEffect(() => {
    console.log(faults);
  }, [faults]);

  return {
    state: {
      shift,
      focus,
      faults,
      histories,
      focusedDayInfo,
      foldedLevels,
      shiftStatus,
      changeStatus,
    },
    actions: {
      foldLevel,
      changeFocusedShift,
      changeFocus: setFocus,
    },
  };
};

export default MakeShiftPageViewModel;
