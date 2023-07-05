/* eslint-disable @typescript-eslint/no-unused-vars */

/** 근무 형태 타입 */
type Shift = {
  /** 근무 형태의 이름이다. @example 데이 */
  fullname: string;
  /** 근무 형태의 약어이다. @example D */
  shortName: string;
  /** 근무 시작 시간 @example 07:00 */
  startTime: string;
  /** 근무 종료 시간 @example 15:00 */
  endTime: string;
  /** 근무 입력 단축키 @example ['D', 'd', 'ㅇ', '1']*/
  hotKey: string[];
  /** 근무 표시 색상 */
  color: string;
};

/** 근무 형태를 배열로 나타내며 다음 규칙에 따라 정렬되어야 한다.
 * OFF는 반드시 0번
 * 나머지 근무 형태는 근무 시작 시간이 빠른 순서.
 * @example
 * [OFF, DAY, EVENING, NIGHT]
 */
type ShiftList = Shift[];

/** 근무표 타입 */
type Duty = {
  /** 근무표의 월 */
  month: number;
  /** 지난달 근무표의 날짜들 */
  lastDays: Day[];
  /** 이번달 근무표의 날짜들 */
  days: Day[];
  /** 듀티표에서 간호사별(한 행) 근무 데이터 */
  dutyRows: DutyRow[];
  /** 숙련도별 간호사 근무데이터 */
  dutyRowsByProficiency: { proficiency: number; dutyRows: DutyRow[] }[];
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
