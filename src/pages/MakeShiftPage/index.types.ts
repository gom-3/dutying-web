/* eslint-disable @typescript-eslint/no-unused-vars */
interface Focus {
  level: number;
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

interface EditHistory {
  nurse: Nurse;
  focus: Focus;
  prevShiftType: ShiftType | null;
  nextShiftType: ShiftType | null;
  dateString: string;
}

type FaultType =
  | 'twoOffAfterNight' // NOD | NOE
  | 'ed' // ED
  | 'maxContinuousWork' // DDDEEE
  | 'maxContinuousNight' // NNNN
  | 'minNightInterval' // NOON
  | 'singleNight' // ONO
  | 'maxContinuousOff' // OOOO
  | 'pongdang' // EOEO | DODO
  | 'noeeod'; // NOE | EOD

type CheckFaultOptions = {
  [key in FaultType]: {
    type: 'wrong' | 'bad';
    isActive: boolean;
    regExp: RegExp;
    message: string;
  };
};

type Fault = {
  type: 'wrong' | 'bad';
  faultType: FaultType;
  nurse: Nurse;
  message: string;
  focus: Focus;
  matchString: string;
  length: number;
};

interface MakeShiftPageState {
  month: number;
  shift: Shift | undefined;
  focus: Focus | null;
  faults: Map<string, Fault>;
  histories: EditHistory[];
  focusedDayInfo: DayInfo | null;
  foldedLevels: boolean[] | null;
  shiftStatus: 'error' | 'success' | 'loading';
  changeStatus: 'error' | 'success' | 'loading' | 'idle';
  isNurseTabOpen: boolean;
}

interface MakeShiftPageActions {
  foldLevel: (level: Nurse['level']) => void;
  changeMonth: (type: 'prev' | 'next') => void;
  changeFocus: (focus: Focus | null) => void;
  changeFocusedShift: (shiftTypeIndex: number) => void;
  setIsNurseTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MakeShiftPageHook {
  (): { state: MakeShiftPageState; actions: MakeShiftPageActions };
}
