/* eslint-disable @typescript-eslint/no-unused-vars */
type Focus = {
  level: number;
  day: number;
  row: number;
};

type DayInfo = {
  countByShiftList: { count: number; shiftType: WardShiftType }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
};

type EditHistory = {
  shiftTeamId: number;
  nurse: Nurse;
  focus: Focus;
  prevShiftType: WardShiftType | null;
  nextShiftType: WardShiftType | null;
  dateString: string;
};

type FaultType =
  | 'maxContinuousWork'
  | 'minNightInterval'
  | 'maxContinuousNight'
  | 'minContinuousNight'
  | 'minOffAssignAfterNight'
  | 'excludeCertainWorkTypes'
  | 'excludeNightBeforeReqOff';

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

type Faults = Map<string, Fault>;
