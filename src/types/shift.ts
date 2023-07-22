/* eslint-disable @typescript-eslint/no-unused-vars */
/** 근무 형태 타입 */
type ShiftType = {
  /** 근무 타입 id */
  shiftTypeId: number;
  /** 병동 id */
  wardId: number;
  /** 근무 형태의 이름이다. @example 데이 */
  name: string;
  /** 근무 형태의 약어이다. @example D */
  shortName: string;
  /** 근무 시작 시간 @example 07:00 */
  startTime: string;
  /** 근무 종료 시간 @example 15:00 */
  endTime: string;
  /** 근무 표시 색상 */
  color: string;
  /** 기본 값 여부 (D,E,N,O 인지) */
  isDefault: boolean;
  /** 휴가 여부 */
  isOff: boolean;
  hotkey: string[];
};

/** 근무표 타입 */
type Shift = {
  /** 지난달 근무표의 날짜들 */
  lastDays: Array<Day>;
  /** 이번달 근무표의 날짜들 */
  days: Array<Day>;
  /** 해당 근무표의 근무유형 리스트 */
  shiftTypes: ShiftType[];
  /** 숙련도별로 묶은 근무 데이터 */
  levelNurses: Row[][];
};

/** 근무표 날짜의 타입 | 평일, 주말, 공휴일 구분이 필요하다 */
type Day = { day: number; dayType: 'saturday' | 'sunday' | 'holiday' | 'workday' };

/** 근무표 한줄에 해당하는 데이터 */
type Row = {
  nurse: Nurse;
  /** 이월 @example 1 */
  carried: number;
  /** 전달 근무 정보, 근무 유형의 index 배열 형식이다. */
  lastShiftTypeIndexList: { reqShift: number | null; shift: number | null }[];
  /** 이번달 근무 정보, 근무 유형의 index 배열 형식이다. */
  shiftTypeIndexList: { reqShift: number | null; shift: number | null }[];
};

/** 신청 근무표 타입 */
type RequestShift = {
  /** 이번달 근무표의 날짜들 */
  days: Array<Day>;
  /** 해당 근무표의 근무유형 리스트 */
  shiftTypes: ShiftType[];
  /** 숙련도별로 묶은 근무 데이터 */
  levelNurses: {
    nurse: Nurse;
    /** 이월 @example 1 */
    carry: number;
    /** 이번달 근무 정보, 근무 유형의 index 배열 형식이다. */
    shiftTypeIndexList: { reqShift: number | null }[];
  }[][];
};
