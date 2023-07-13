import { mockDuty, mockShiftList } from '@mocks/duty/data';
import { useQueries } from '@tanstack/react-query';
import { useRef } from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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

type MakeDutyPageState = {
  duty: Duty | null;
  shiftList: ShiftList | null;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  rowContainerRef: React.RefObject<HTMLElement>;
  focusedCellRef: React.RefObject<HTMLElement>;
  foldedlevels: boolean[];
};

type MakeDutyPageActions = {
  handleFold: () => void;
  handleFocusChange: (focus: Focus | null) => void;
  handleFocusedDutyChange: (shift: Shift) => void;
};

const useStore = create<MakeDutyPageState>()(
  devtools(
    persist(
      (set) => ({
        duty: null,
        shiftList: null,
        focus: null,
        focusedCellRef: useRef(null),
        rowContainerRef: useRef(null),
        focusedDayInfo: null,
        foldedlevels: [false, false, false, false],
        setState: (key: keyof MakeDutyPageState, value: any) =>
          set((state) => ({ ...state, [key]: value })),
      }),
      {
        name: 'makeDutyPageState',
      }
    )
  )
);

const useMakeDutyPageViewModel = () => {
  const [duty, shiftList] = useQueries({
    queries: [
      { queryKey: ['duty'], queryFn: () => mockDuty },
      { queryKey: ['shiftList'], queryFn: () => mockShiftList },
    ],
  });

  const state = useStore((state) => state);

  return {
    state,
    actions: {} as MakeDutyPageActions,
  };
};
