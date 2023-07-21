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
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo] = useState<DayInfo | null>(null);
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
    ({ shift, focus, shiftTypeId }: { shift: Shift; focus: Focus; shiftTypeId: number | null }) =>
      updateShift(
        year,
        month,
        shift.days[focus.day].day,
        shift.levelNurses[focus.level][focus.row].nurse.nurseId,
        shiftTypeId
      ),
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
                            shift: newShiftTypeIndex === -1 ? null : newShiftTypeIndex,
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
      if (month === 7) return;
      else setMonth(month - 1);
    } else if (type === 'next') {
      // if (month === 12) {
      //   setMonth(1);
      //   setYear(year + 1);
      // } else {
      //   setMonth(month + 1);
      // }
      if (month === 8) return;
      else setMonth(month + 1);
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
    if (!focus || !shift) return;
    moveFocusByKeydown(e, shift, focus, setFocus);
    keydownEventMapper(
      e,
      ...shift.shiftTypes.map((shiftType) => ({
        keys: [shiftType.shortName],
        callback: () => {
          if (shiftType.shortName.toUpperCase() === koToEn(e.key).toUpperCase() && focus) {
            changeFocusedShift(shiftType.shiftTypeId);
          }
        },
      })),
      { keys: ['Backspace'], callback: () => changeFocusedShift(null) }
    );
  };

  useEffect(() => {
    console.log(shift);
    checkShift();
  }, [shift]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
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
      isNurseTabOpen,
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocusedShift,
      changeFocus: setFocus,
      setIsNurseTabOpen,
    },
  };
};

export default useMakeShiftPageHook;

const moveFocusByKeydown = (
  e: KeyboardEvent,
  shift: Shift,
  focus: Focus,
  setFocus: (focus: Focus) => void
) => {
  const { level, day, row } = focus;
  const levelCnt = shift.levelNurses.length;
  const rowCnt = shift.levelNurses[level].length;
  const dayCnt = shift.days.length;
  let newLevel = level;
  let newDay = day;
  let newRow = row;

  if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) != -1) {
    e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
  }

  switch (e.key) {
    case 'ArrowLeft': {
      if (day === 0) {
        if (row === 0) {
          newLevel = level === 0 ? levelCnt - 1 : level - 1;
          newDay = dayCnt - 1;
          newRow = shift.levelNurses[newLevel].length - 1;
        } else {
          newDay = dayCnt - 1;
          newRow = row - 1;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
        newRow = row;
      }
      break;
    }
    case 'ArrowRight': {
      if (day === dayCnt - 1) {
        if (row === rowCnt - 1) {
          newLevel = level === levelCnt - 1 ? 0 : level + 1;
          newDay = 0;
          newRow = 0;
        } else {
          newRow = row + 1;
          newDay = 0;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? dayCnt - 1 : Math.min(dayCnt - 1, day + 1);
        newRow = row;
      }
      break;
    }
    case 'ArrowUp': {
      if (row === 0) {
        newLevel = level === 0 ? levelCnt - 1 : level - 1;
        newDay = day;
        newRow = shift.levelNurses[newLevel].length - 1;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
      }
      break;
    }
    case 'ArrowDown': {
      if (row === rowCnt - 1) {
        newLevel = level === levelCnt - 1 ? 0 : level + 1;
        newDay = day;
        newRow = 0;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? rowCnt - 1 : row + 1;
      }
      break;
    }
  }

  setFocus({
    level: newLevel,
    day: newDay,
    row: newRow,
  });
};

const keydownEventMapper = (
  e: KeyboardEvent,
  ...op: { keys: string[]; callback: () => void }[]
) => {
  op.forEach(({ keys, callback }) => {
    if (keys.map((key) => key.toUpperCase()).indexOf(koToEn(e.key).toUpperCase()) != -1) {
      callback();
    }
  });
};
