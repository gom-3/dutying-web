/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { shiftList, duty as mockDuty, dutyConstraint } from '@mocks/duty/data';

export type Focus = {
  proficiency: Nurse['proficiency'];
  day: number;
  row: number;
};

export type DayInfo = {
  /** @example D E N O가 각각 1, 2, 3, 4 이면 [4, 1, 2, 3] */
  countByShiftList: { count: number; standard: number }[];
  month: number;
  day: number;
  nurse: Nurse;
};

const useEditDuty = () => {
  const [duty, setDuty] = useState(mockDuty);
  const [foldedProficiency, setFoldedProficiency] = useState(
    Array.from({ length: dutyConstraint.proficiencyDivision }).map(() => false)
  );
  const [focus, setFocus] = useState<Focus | null>(null);
  const [focusedDayInfo, setFocusedDayInfo] = useState<DayInfo | null>(null);
  const focusedCellRef = useRef<HTMLElement>(null);
  const rowContainerRef = useRef<HTMLDivElement>(null);

  const handleFold = useCallback(
    (proficiency: Nurse['proficiency']) => {
      console.log(foldedProficiency);
      console.log(
        foldedProficiency.map((isFolded, index) =>
          index === dutyConstraint.proficiencyDivision - proficiency ? !isFolded : isFolded
        )
      );
      setFoldedProficiency(
        foldedProficiency.map((isFolded, index) =>
          index === dutyConstraint.proficiencyDivision - proficiency ? !isFolded : isFolded
        )
      );
    },
    [foldedProficiency]
  );

  // Focus된 셀의 근무를 ShiftIndex를 통해 변경
  const handleFocusedDutyChange = useCallback(
    (newShiftIndex: number) => {
      if (focus === null) return;

      setDuty((duty) => ({
        ...duty,
        dutyRowsByProficiency: duty.dutyRowsByProficiency.map((dutyRowsByProficiency) => ({
          ...dutyRowsByProficiency,
          dutyRows: dutyRowsByProficiency.dutyRows.map((dutyRow, index) =>
            focus.row === index && focus.proficiency === dutyRowsByProficiency.proficiency
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

      const { proficiency, day, row } = focus;
      const rows = duty.dutyRowsByProficiency[4 - proficiency].dutyRows;
      let newProficiency = proficiency;
      let newDay = day;
      let newRow = row;

      if (e.key === 'ArrowLeft') {
        if (day === 0) {
          if (row === 0) {
            newProficiency =
              proficiency === dutyConstraint.proficiencyDivision ? 1 : proficiency + 1;
            newDay = duty.days.length - 1;
            newRow =
              duty.dutyRowsByProficiency.find((x) => x.proficiency === newProficiency)!.dutyRows
                .length - 1;
          } else {
            newDay = duty.days.length - 1;
            newRow = row - 1;
          }
        } else {
          newDay = e.ctrlKey || e.metaKey ? 0 : Math.max(0, day - 1);
          newRow = row;
        }
        setFocus({ proficiency: newProficiency! || proficiency, day: newDay, row: newRow });
      }
      if (e.key === 'ArrowRight') {
        if (day === duty.days.length - 1) {
          if (row === rows.length - 1) {
            newProficiency =
              proficiency === 1 ? dutyConstraint.proficiencyDivision : proficiency - 1;
            newDay = 0;
            newRow = 0;
          } else {
            newRow = row + 1;
            newDay = 0;
          }
        } else {
          newDay =
            e.ctrlKey || e.metaKey ? duty.days.length - 1 : Math.min(duty.days.length - 1, day + 1);
          newRow = row;
        }
        setFocus({ proficiency: newProficiency, day: newDay, row: newRow });
      }

      if (e.key === 'ArrowUp') {
        if (row === 0) {
          newProficiency = proficiency === dutyConstraint.proficiencyDivision ? 1 : proficiency + 1;
          newDay = day;
          newRow =
            duty.dutyRowsByProficiency.find((x) => x.proficiency === newProficiency)!.dutyRows
              .length - 1;
        } else {
          newDay = day;
          newRow = e.ctrlKey || e.metaKey ? 0 : row - 1;
        }
        setFocus({ proficiency: newProficiency, day: newDay, row: newRow });
      }

      if (e.key === 'ArrowDown') {
        if (
          row ===
          duty.dutyRowsByProficiency.find((x) => x.proficiency === proficiency)!.dutyRows.length - 1
        ) {
          newProficiency = proficiency === 1 ? dutyConstraint.proficiencyDivision : proficiency - 1;
          newDay = day;
          newRow = 0;
        } else {
          newDay = day;
          newRow =
            e.ctrlKey || e.metaKey
              ? duty.dutyRowsByProficiency.find((x) => x.proficiency === newProficiency)!.dutyRows
                  .length - 1
              : row + 1;
        }
        setFocus({ proficiency: newProficiency, day: newDay, row: newRow });
      }
      shiftList.forEach((shift, index) => {
        if (shift.hotKey.includes(e.key)) {
          handleFocusedDutyChange(index);
        }
      });
    },
    [duty, focus, handleFocusedDutyChange]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (focus) {
      const focusRect = focusedCellRef?.current?.getBoundingClientRect();
      const container = rowContainerRef.current;
      if (focusRect && container) {
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
      }

      setFocusedDayInfo({
        month: duty.month,
        day: focus.day ?? 0,
        countByShiftList: shiftList.map((_, shiftIndex) => ({
          count: duty.dutyRows.filter((dutyRow) => dutyRow.shiftIndexList[focus.day] === shiftIndex)
            .length,
          standard:
            duty.days[focus.day].dayKind === 'workday'
              ? dutyConstraint.dutyStandard.workday[shiftIndex]
              : dutyConstraint.dutyStandard.weekend[shiftIndex],
        })),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        nurse: duty.dutyRows.find((_, index) => index === focus.row)?.user!,
      });
    } else {
      setFocusedDayInfo(null);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focus, duty, handleKeyDown]);

  return {
    /** 근무표 데이터 */
    duty,
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
    shiftList,
    handlers: {
      handleFold,
      /** 근무 셀 선택 */
      handleFocusChange: setFocus,
      /** 현재 선택한 근무의 값 변경 */
      handleFocusedDutyChange,
    },
  };
};

export default useEditDuty;
