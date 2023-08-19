/* eslint-disable @typescript-eslint/no-unused-vars */

/** 근무표 타입 */
type Shift = {
  /** 지난달 근무표의 날짜들 */
  lastDays: Array<Day>;
  /** 이번달 근무표의 날짜들 */
  days: Array<Day>;
  /** 해당 근무표의 근무유형 리스트 */
  wardShiftTypes: WardShiftType[];
  /** 구분된 근무 데이터 */
  divisionShiftNurses: Row[][];
};

/** 근무표 날짜의 타입 | 평일, 주말, 공휴일 구분이 필요하다 */
type Day = { day: number; dayType: 'saturday' | 'sunday' | 'holiday' | 'workday' };

/** 근무표 한줄에 해당하는 데이터 */
type Row = {
  shiftNurse: ShiftNurse;
  lastWardShiftList: (number | null)[];
  lastWardReqShiftList: (number | null)[];
  wardShiftList: (number | null)[];
  wardReqShiftList: (number | null)[];
};

/** 신청 근무표 타입 */
type RequestShift = {
  /** 이번달 근무표의 날짜들 */
  days: Array<Day>;
  /** 해당 근무표의 근무유형 리스트 */
  wardShiftTypes: WardShiftType[];
  /** 구분된 근무 데이터 */
  divisionNumNurses: {
    shiftNurse: ShiftNurse;
    /** 이월 @example 1 */
    carry: number;
    /** 이번달 근무 정보, 근무 유형의 index 배열 형식이다. */
    wardReqShiftList: (number | null)[];
  }[][];
};
