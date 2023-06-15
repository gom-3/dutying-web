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
};

/** 근무표 날짜의 타입 | 평일, 주말, 공휴일 구분이 필요하다 */
type Day = { day: number; dayKind: 'saturday' | 'sunday' | 'holyday' | 'workday' };

/** 간호사의 근무 데이터 */
type DutyRow = {
  /** 간호사 정보 */
  user: User;
  /** 이월 @example 1 */
  carry: number;
  /** 전달 근무 정보
   * @example
   * Off: 0, Day: 1, Evening: 2, Night: 3 일 때
   * DDEN은 [1, 1, 2, 3]이다.
   */
  lastShiftList: ShiftKind['id'][];
  /** 이번달 근무 정보
   * @example
   * Off: 0, Day: 1, Evening: 2, Night: 3 일 때
   * DDEN은 [1, 1, 2, 3]이다.
   */
  shiftList: ShiftKind['id'][];
};

/** 근무 형태 타입 */
type ShiftKind = {
  /** 근무 형태를 id로 구분한다 */
  id: number;
  /** 근무 형태의 이름이다. @example Day */
  fullname: string;
  /** 근무 형태의 약어이다. @example D */
  name: string;
  /** 근무 시작 시간 @example 07:00 */
  startTime: string;
  /** 근무 종료 시간 @example 15:00 */
  endTime: string;
};

/** 근무 제약조건 타입 */
type DutyConstraint = {
  /** 교대 수 @example 2, 3, 4 */
  rotation: number;
  /** 연속 근무 수 @example 4 */
  straight: number;
  /** 나이트 간격 @example 7 */
  nightInterval: number;
  /** 기준 근무 수
   * @example
   * {
   *    workday: [4, 3, 3]
   *    holyday: [3, 3, 3]
   * }
   */
  dutyStandard: {
    /** 평일 기준 근무 수 */
    workday: number[];
    /** 휴일 기준 근무 수 */
    holyday: number[];
  };
  /** 근무 신청 제한
   * @example
   * none: 근무 신청을 받지 않음
   * off: 휴가 신청만 받음
   * all: 휴가, 근무 신청 모두 받음
   */
  requestDutyType: 'none' | 'off' | 'all';
};

// @TODO 간호사 개인이 보는 근무표에 대한 데이터 타입은 따로 정의가 필요하다.
