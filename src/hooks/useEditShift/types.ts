/* eslint-disable @typescript-eslint/no-unused-vars */
type Focus = {
  nurse: Nurse;
  day: number;
};

type DayInfo = {
  countByShiftList: { count: number; shiftType: ShiftType }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
};

type EditHistory = {
  year: number;
  month: number;
  focus: Focus;
  prevShiftType: ShiftType | null;
  nextShiftType: ShiftType | null;
  dateString: string;
}[];

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
  message: string;
  focus: Focus;
  matchString: string;
  length: number;
};

type Faults = Map<string, Fault>;
