import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRequestShift, updateRequestShift } from '@libs/api/shift';
import { useAccount } from 'store';
import { koToEn } from '@libs/util/koToEn';

const useRequestShiftPageHook = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  // @TODO 현재 달로 수정
  const [month, setMonth] = useState(8);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [foldedLevels, setFoldedLevels] = useState<boolean[] | null>(null);
  const { account } = useAccount();

  const queryClient = useQueryClient();
  const requestShiftQueryKey = ['requestShift', account.nurseId, year, month];
  const { data: requestShift } = useQuery(
    requestShiftQueryKey,
    () => getRequestShift(account.wardId, year, month),
    {
      onSuccess: (data) => setFoldedLevels(data.levelNurses.map(() => false)),
    }
  );
  const { mutate: focusedShiftChange, status: changeStatus } = useMutation(
    ({
      requestShift,
      focus,
      shiftTypeId,
    }: {
      requestShift: RequestShift;
      focus: Focus;
      shiftTypeId: number | null;
    }) =>
      updateRequestShift(
        year,
        month,
        requestShift.days[focus.day].day,
        requestShift.levelNurses[focus.level][focus.row].nurse.nurseId,
        shiftTypeId
      ),
    {
      onMutate: async ({ focus, shiftTypeId }) => {
        await queryClient.cancelQueries(['shift']);
        const oldShift = queryClient.getQueryData<RequestShift>(requestShiftQueryKey);

        if (!oldShift) return;
        const newShiftTypeIndex = oldShift.shiftTypes.findIndex(
          (x) => x.shiftTypeId === shiftTypeId
        );

        queryClient.setQueryData<RequestShift>(requestShiftQueryKey, {
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
                            reqShift: newShiftTypeIndex === undefined ? null : newShiftTypeIndex,
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
      },
    }
  );

  const foldLevel = (level: Nurse['level']) => {
    if (!requestShift || !foldedLevels) return;
    setFoldedLevels(foldedLevels.map((x, index) => (index === level ? !x : x)));
  };

  const changeMonth = (type: 'prev' | 'next') => {
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

  const changeFocusedShift = (shiftTypeId: number | null) => {
    if (
      !focus ||
      !requestShift ||
      requestShift.levelNurses[focus.level][focus.row].shiftTypeIndexList[focus.day].reqShift ===
        requestShift.shiftTypes.findIndex((x) => x.shiftTypeId === shiftTypeId)
    )
      return;
    focusedShiftChange({ requestShift, focus, shiftTypeId });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!focus || !requestShift) return;
    moveFocusByKeydown(e, requestShift, focus, setFocus);
    keydownEventMapper(
      e,
      ...requestShift.shiftTypes.map((shiftType) => ({
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
      changeStatus,
    },
    actions: {
      foldLevel,
      changeMonth,
      changeFocus: setFocus,
    },
  };
};

export default useRequestShiftPageHook;

const moveFocusByKeydown = (
  e: KeyboardEvent,
  shift: RequestShift,
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
