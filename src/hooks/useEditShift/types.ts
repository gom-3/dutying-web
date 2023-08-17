/* eslint-disable @typescript-eslint/no-unused-vars */
type Focus = {
  shiftNurseName: string;
  shiftNurseId: number;
  day: number;
};

type DayInfo = {
  countByShiftList: { count: number; shiftType: WardShiftType }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
};

type EditHistory = Map<
  string,
  {
    current: number;
    history: {
      nurseName: string;
      focus: Focus;
      prevShiftType: WardShiftType | null;
      nextShiftType: WardShiftType | null;
      dateString: string;
    }[];
  }
>;

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
  message: string;
  nurseName: string;
  focus: Focus;
  matchString: string;
  length: number;
};

type Faults = Map<string, Fault>;
