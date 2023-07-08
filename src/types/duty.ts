/* eslint-disable @typescript-eslint/no-unused-vars */
/** 근무표 타입 */
type Duty = {
  /** 근무표의 월 */
  month: number;
  /** 지난달 근무표의 날짜들 */
  lastDays: Array<Day>;
  /** 이번달 근무표의 날짜들 */
  days: Array<Day>;
  /** 숙련도별 간호사 근무데이터 */
  dutyRowsByLevel: Array<{ level: number; dutyRows: Array<DutyRow> }>;
};

/** 근무표 날짜의 타입 | 평일, 주말, 공휴일 구분이 필요하다 */
type Day = { day: number; dayKind: 'saturday' | 'sunday' | 'holyday' | 'workday' };

/** 간호사의 근무 데이터 */
type DutyRow = {
  /** 간호사 정보 */
  user: Nurse;
  /** 이월 @example 1 */
  carry: number;
  /** 전달 근무 정보
   * 근무형태의 인덱스의 배열로 나타낸다.
   * @example
   * DDEN은 [1, 1, 2, 3]이다.
   */
  lastShiftIndexList: number[];
  /** 이번달 근무 정보
   * 근무형태의 인덱스의 배열로 나타낸다.
   * @example
   * DDEN은 [1, 1, 2, 3]이다.
   */
  shiftIndexList: number[];
};
