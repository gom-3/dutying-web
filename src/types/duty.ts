/** 전체 근무 데이터 */
type Duty = {
  month: number;
  schdule: Schedule[];
};

/** 개인의 근무 데이터 */
type Schedule = {
  month: number;
  user: User;
  carry: number;
  lastShiftList: DayDuty[];
  shiftList: DayDuty[];
};

/** 날짜별 근무 타입 */
type DayDuty = {
  /** 날짜 */
  day: number;
  /** 근무 형태종류 */
  shiftId: number;
  /** 일과, 토요일, 일요일, 공휴일 구분 */
  dayKind: 'saturday' | 'sunday' | 'holyday' | 'workday';
};

/** 근무 형태 타입 */
type Shift = {
  id: number;
  fullname: string;
  name: string;
  startTime: string;
  endTime: string;
};
