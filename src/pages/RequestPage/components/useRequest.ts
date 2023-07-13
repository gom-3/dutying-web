/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect, useRef, useState } from 'react';
import { mockShiftList, requestDuty as mockRequestDuty, mockDutyStandard } from '@mocks/duty/data';
import { mockWard } from '@mocks/ward/data';

export type Focus = {
  level: Nurse['level'];
  day: number;
  row: number;
  openTooltip: boolean;
};

export type DayInfo = {
  /** @example D E N O가 각각 1, 2, 3, 4 이면 [4, 1, 2, 3] */
  countByShiftList: { count: number; standard: number; shift: Shift }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
  tooltipLeft: number;
  tooltipTop: number;
};

const useRequest = () => {
  const [requestDuty, setRequestDuty] = useState(mockRequestDuty);
  const [foldedProficiency, setFoldedProficiency] = useState(
    Array.from({ length: mockWard.levelDivision }).map(() => false)
  );
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo, setFocusedDayInfo] = useState<DayInfo | null>(null);
  const focusedCellRef = useRef<HTMLElement>(null);
  const rowContainerRef = useRef<HTMLDivElement>(null);

  const handleFold = useCallback(
    (level: Nurse['level']) => {
      console.log(foldedProficiency);
      console.log(
        foldedProficiency.map((isFolded, index) =>
          index === mockWard.levelDivision - level ? !isFolded : isFolded
        )
      );
      setFoldedProficiency(
        foldedProficiency.map((isFolded, index) =>
          index === mockWard.levelDivision - level ? !isFolded : isFolded
        )
      );
    },
    [foldedProficiency]
  );

  // Focus된 셀의 근무를 ShiftIndex를 통해 변경
  const handleFocusedDutyChange = useCallback(
    (newShiftIndex: number) => {
      if (focus === null) return;

      setRequestDuty((duty) => ({
        ...duty,
        requestRowsByLevel: duty.requestRowsByLevel.map((dutyRowsByProficiency) => ({
          ...dutyRowsByProficiency,
          dutyRows: dutyRowsByProficiency.dutyRows.map((dutyRow, index) =>
            focus.row === index && focus.level === dutyRowsByProficiency.level
              ? {
                  ...dutyRow,
                  shiftIndexList: dutyRow.shiftIndexList.map((shiftIndex, day) =>
                    day === focus.day ? newShiftIndex : shiftIndex
                  ),
                }
              : dutyRow
          ),
        })),
      }));
    },
    [focus]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        ['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1
      ) {
        e.preventDefault(); // Key 입력으로 화면이 이동하는 것을 막습니다.
      }

      if (focus === null) return;

      const { level, day, row } = focus;
      const rows = requestDuty.requestRowsByLevel[mockWard.levelDivision - level].dutyRows;
      let newProficiency = level;
      let newDay = day;
      let newRow = row;

      if (e.key === 'ArrowLeft') {
        if (day === 0) {
          if (row === 0) {
            newProficiency = level === mockWard.levelDivision ? 1 : level + 1;
            newDay = requestDuty.days.length - 1;
            newRow =
              requestDuty.requestRowsByLevel.find((x) => x.level === newProficiency)!.dutyRows
                .length - 1;
          } else {
            newDay = requestDuty.days.length - 1;
            newRow = row - 1;
          }
        } else {
          newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
          newRow = row;
        }
        setFocus({
          level: newProficiency! || level,
          day: newDay,
          row: newRow,
          openTooltip: false,
        });
      }
      if (e.key === 'ArrowRight') {
        if (day === requestDuty.days.length - 1) {
          if (row === rows.length - 1) {
            newProficiency = level === 1 ? mockWard.levelDivision : level - 1;
            newDay = 0;
            newRow = 0;
          } else {
            newRow = row + 1;
            newDay = 0;
          }
        } else {
          newDay =
            e.ctrlKey || e.metaKey
              ? requestDuty.days.length - 1
              : Math.min(requestDuty.days.length - 1, day + 1);
          newRow = row;
        }
        setFocus({ level: newProficiency, day: newDay, row: newRow, openTooltip: false });
      }

      if (e.key === 'ArrowUp') {
        if (row === 0) {
          newProficiency = level === mockWard.levelDivision ? 1 : level + 1;
          newDay = day;
          newRow =
            requestDuty.requestRowsByLevel.find((x) => x.level === newProficiency)!.dutyRows
              .length - 1;
        } else {
          newDay = day;
          newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
        }
        setFocus({ level: newProficiency, day: newDay, row: newRow, openTooltip: false });
      }

      if (e.key === 'ArrowDown') {
        if (
          row ===
          requestDuty.requestRowsByLevel.find((x) => x.level === level)!.dutyRows.length - 1
        ) {
          newProficiency = level === 1 ? mockWard.levelDivision : level - 1;
          newDay = day;
          newRow = 0;
        } else {
          newDay = day;
          newRow =
            e.ctrlKey || e.metaKey
              ? requestDuty.requestRowsByLevel.find((x) => x.level === newProficiency)!.dutyRows
                  .length - 1
              : row + 1;
        }
        setFocus({ level: newProficiency, day: newDay, row: newRow, openTooltip: false });
      }

      if (e.key === 'Space' || e.key === ' ') {
        setFocus({ ...focus, openTooltip: !focus.openTooltip });
      }
      mockShiftList.forEach((shift, index) => {
        if (shift.shortName.toUpperCase() === e.key.toUpperCase()) {
          handleFocusedDutyChange(index);
        }
      });
    },
    [requestDuty, focus, handleFocusedDutyChange]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (focus) {
      const focusRect = focusedCellRef?.current?.getBoundingClientRect();
      const container = rowContainerRef.current;
      if (!focusRect || !container) return;

      // 셀이 화면 오른쪽에 있을 때 오른쪽으로 충분히 화면을 이동한다.
      if (focusRect.x + focusRect.width - container.offsetLeft > container.clientWidth)
        container.scroll({
          left: focusRect.left + container.scrollLeft,
        });
      // 셀이 화면 왼쪽에 있을 때 왼쪽 끝으로 화면을 이동한다.
      if (focusRect.x - container.offsetLeft < 0) container.scroll({ left: 0 });
      // 셀이 화면 아래에 있을 때 아래로 충분히 화면을 이동한다.
      if (focusRect.y + focusRect.height - container.offsetTop > container.clientHeight)
        container.scroll({
          top: focusRect.top + container.scrollTop,
        });
      // 셀이 화면 위에 있을 때 한칸씩 위로 화면을 이동한다.
      if (focusRect.y - container.offsetTop < 0)
        container.scroll({ top: focusRect.top + window.scrollY - 132 });

      setFocusedDayInfo({
        month: requestDuty.month,
        day: focus.day ?? 0,
        countByShiftList: mockShiftList.map((_, shiftIndex) => ({
          count: requestDuty.requestRowsByLevel
            .flatMap((row) => row.dutyRows)
            .filter((dutyRow) => dutyRow.shiftIndexList[focus.day] === shiftIndex).length,
          standard:
            requestDuty.days[focus.day].dayKind === 'workday'
              ? mockDutyStandard.workday[shiftIndex]
              : mockDutyStandard.weekend[shiftIndex],
          shift: mockShiftList[shiftIndex],
        })),
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        nurse: requestDuty.requestRowsByLevel
          .flatMap((row) => row.dutyRows)
          .find((_, index) => index === focus.row)?.user!,
        message: '3연속 N 근무 후 2일 이상 OFF를 권장합니다.',
        tooltipLeft: focusRect.x + focusRect.width / 2,
        tooltipTop: focusRect.y + focusRect.height,
      });
    } else {
      setFocusedDayInfo(null);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, requestDuty, handleKeyDown]);

  return {
    /** 근무표 데이터 */
    requestDuty,
    /** 접힌 숙련도 */
    foldedProficiency,
    /** 현재 선택한 근무 셀 */
    focus,
    /** 현재 선택한 근무 셀의 정보 */
    focusedDayInfo,
    /** 선택 대상의 셀의 ref */
    focusedCellRef,
    rowContainerRef,
    /** 근무 유형 */
    shiftList: mockShiftList,
    handlers: {
      handleFold,
      /** 근무 셀 선택 */
      handleFocusChange: setFocus,
      /** 현재 선택한 근무의 값 변경 */
      handleFocusedDutyChange,
    },
  };
};

export default useRequest;
