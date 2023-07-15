/* eslint-disable @typescript-eslint/no-unused-vars */
interface Focus {
  level: Nurse['level'];
  day: number;
  row: number;
  openTooltip: boolean;
}

interface DayInfo {
  countByShiftList: { count: number; shiftType: ShiftType }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
}

interface MakeShiftPageViewModelState {
  shift: Shift | undefined;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  isLoading: boolean;
}

interface MakeShiftPageViewModelActions {
  foldLevel: (level: Nurse['level']) => void;
  changeFocus: (focus: Focus | null) => void;
  changeFocusedShift: (shiftTypeIndex: number) => void;
}

interface MakeShiftPageViewModel {
  (): { state: MakeShiftPageViewModelState; actions: MakeShiftPageViewModelActions };
}
