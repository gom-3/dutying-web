import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockRequestShift } from '@mocks/shift';

const requestShiftData = mockRequestShift;

/**추후 서버 API로 대체 */
const getRequestShiftApi = () => {
  return new Promise<RequestShift>((resolve) => {
    setTimeout(() => {
      resolve(requestShiftData);
    }, 500);
  });
};

const updateFocusedRequestShiftApi = (focus: Focus, shiftTypeIndex: number) => {
  requestShiftData.levels[focus.level][focus.row].shiftTypeIndexList[focus.day].current =
    shiftTypeIndex;
  return new Promise<RequestShift>((resolve) => {
    setTimeout(() => {
      resolve(requestShiftData);
    }, 500);
  });
};

const SHIFT_KEY = 'request_shift';

const RequestShiftPageViewModel: RequestShiftPageViewModel = () => {
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo, setFocusedDayInfo] = useState<DayInfo | null>(null);
  const [foldedLevels, setFoldedLevels] = useState<boolean[] | null>(null);

  const queryClient = useQueryClient();
  const { data: requestShift, isLoading } = useQuery([SHIFT_KEY], getRequestShiftApi, {
    onSuccess: (data) => setFoldedLevels(data.levels.map(() => false)),
  });
  const { mutate: focusedShiftChange } = useMutation(
    ({ focus, shiftTypeIndex }: { focus: Focus; shiftTypeIndex: number }) =>
      updateFocusedRequestShiftApi(focus, shiftTypeIndex),
    {
      onMutate: async ({ focus, shiftTypeIndex }) => {
        await queryClient.cancelQueries([SHIFT_KEY]);
        const oldShift = queryClient.getQueryData<Shift>([SHIFT_KEY]);
        if (oldShift) {
          queryClient.setQueryData<Shift>([SHIFT_KEY], {
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
        }
        return { oldShift };
      },
      onError: (_, __, context) => {
        if (context === undefined || context.oldShift === undefined) return;
        queryClient.setQueryData(['shift'], context.oldShift);
      },
    }
  );

  const foldLevel = (level: Nurse['level']) => {
    if (!requestShift || !foldedLevels) return;

    setFoldedLevels(
      foldedLevels.map((isFolded, index) =>
        index === requestShift.levels.length - level ? !isFolded : isFolded
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!requestShift) return;

    if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
      e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
    }

    if (focus === null) return;

    const { level, day, row } = focus;
    const rows = requestShift.levels[requestShift.levels.length - level];
    let newLevel = level;
    let newDay = day;
    let newRow = row;

    if (e.key === 'ArrowLeft') {
      if (day === 0) {
        if (row === 0) {
          newLevel = level === requestShift.levels.length ? 1 : level + 1;
          newDay = requestShift.days.length - 1;
          newRow = requestShift.levels[level].length - 1;
        } else {
          newDay = requestShift.days.length - 1;
          newRow = row - 1;
        }
      } else {
        newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
        newRow = row;
      }
      setFocus({
        level: newLevel || level,
        day: newDay,
        row: newRow,
        openTooltip: false,
      });
    }
    if (e.key === 'ArrowRight') {
      if (day === requestShift.days.length - 1) {
        if (row === rows.length - 1) {
          newLevel = level === 1 ? requestShift.levels.length : level - 1;
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
      setFocus({ level: newLevel, day: newDay, row: newRow, openTooltip: false });
    }

    if (e.key === 'ArrowUp') {
      if (row === 0) {
        newLevel = level === requestShift.levels.length ? 1 : level + 1;
        newDay = day;
        newRow = requestShift.levels[level].length - 1;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow, openTooltip: false });
    }

    if (e.key === 'ArrowDown') {
      if (row === requestShift.levels[level].length - 1) {
        newLevel = level === 1 ? requestShift.levels.length : level - 1;
        newDay = day;
        newRow = 0;
      } else {
        newDay = day;
        newRow = e.ctrlKey || e.metaKey ? requestShift.levels[level].length - 1 : row + 1;
      }
      setFocus({ level: newLevel, day: newDay, row: newRow, openTooltip: false });
    }

    if (e.key === 'Space' || e.key === ' ') {
      setFocus({ ...focus, openTooltip: !focus.openTooltip });
    }
    requestShift.shiftTypeList.forEach((shiftType, index) => {
      if (shiftType.shortName.toUpperCase() === e.key.toUpperCase() && focus) {
        focusedShiftChange({ focus, shiftTypeIndex: index });
      }
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (requestShift && focus) {
      setFocusedDayInfo({
        month: requestShift.month,
        day: focus.day ?? 0,
        countByShiftList: requestShift.shiftTypeList.map((_, shiftTypeIndex) => ({
          count: requestShift.levels
            .flatMap((row) => row)
            .filter((dutyRow) => dutyRow.shiftTypeIndexList[focus.day].current === shiftTypeIndex)
            .length,
          shiftType: requestShift.shiftTypeList[shiftTypeIndex],
        })),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        nurse: requestShift.levels.flatMap((row) => row).find((_, index) => index === focus.row)
          ?.nurse!,
        message: '3연속 N 근무 후 2일 이상 OFF를 권장합니다.',
      });
    } else {
      setFocusedDayInfo(null);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, requestShift]);

  return {
    state: {
      requestShift,
      focus,
      focusedDayInfo,
      foldedLevels,
      isLoading,
    },
    actions: {
      foldLevel,
      changeFocusedShift: (shiftTypeIndex: number) =>
        focus && focusedShiftChange({ focus, shiftTypeIndex }),
      changeFocus: setFocus,
    },
  };
};

export default RequestShiftPageViewModel;
