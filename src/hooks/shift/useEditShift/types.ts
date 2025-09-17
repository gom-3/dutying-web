import { type Nurse } from '@/types/nurse';
import { type WardShiftType } from '@/types/ward';

export type Focus = {
  shiftNurseName: string;
  shiftNurseId: number;
  day: number;
};

export type DayInfo = {
  countByShiftList: { count: number; shiftType: WardShiftType }[];
  month: number;
  day: number;
  nurse: Nurse;
  message: string;
};

export type EditHistory = Map<
  string,
  {
    current: number;
    history: {
      nurseName: string;
      focus: Focus;
      prevShiftType?: WardShiftType;
      nextShiftType?: WardShiftType;
      dateString: string;
    }[];
  }
>;

export type FaultType =
  | 'maxContinuousWork'
  | 'minNightInterval'
  | 'maxContinuousNight'
  | 'minContinuousNight'
  | 'minOffAssignAfterNight'
  | 'excludeCertainWorkTypes'
  | 'excludeNightBeforeReqOff';

export type CheckFaultOptions = {
  [key in FaultType]: {
    type: 'wrong' | 'bad';
    label: string;
    isActive: boolean;
    regExp: RegExp;
    message: string;
    value: number | null;
  };
};

export type Fault = {
  type: 'wrong' | 'bad';
  faultType: FaultType;
  message: string;
  nurseName: string;
  focus: Focus;
  matchString: string;
  length: number;
};

export type Faults = Map<string, Fault>;
