/* eslint-disable @typescript-eslint/no-unused-vars */
interface Focus {
  level: Nurse['level'];
  day: number;
  row: number;
}

interface DayInfo {
  countByShiftList: { count: number; shiftType: ShiftType }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
}

interface RequestShiftPageState {
  month: number;
  requestShift: RequestShift | undefined;
  focus: Focus | null;
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  isLoading: boolean;
}

interface RequestShiftPageActions {
  foldLevel: (level: Nurse['level']) => void;
  changeFocus: (focus: Focus | null) => void;
  changeFocusedShift: (shiftTypeIndex: number) => void;
}

interface RequestShiftPageHook {
  (): { state: RequestShiftPageState; actions: RequestShiftPageActions };
}
