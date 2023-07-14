/* eslint-disable @typescript-eslint/no-unused-vars */
type Focus = {
  level: Nurse['level'];
  day: number;
  row: number;
  openTooltip: boolean;
};

type DayInfo = {
  countByShiftList: { count: number; shiftType: ShiftType }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
};

interface MakeShiftPageState {
  shift: Shift | undefined;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  isLoading: boolean;
}

interface MakeShiftPageActions {
  foldLevel: (level: Nurse['level']) => void;
  changeFocus: (focus: Focus | null) => void;
  changeFocusedShift: (shiftTypeIndex: number) => void;
}

interface MakeShiftPageViewModel {
  (): { state: MakeShiftPageState; actions: MakeShiftPageActions };
}
