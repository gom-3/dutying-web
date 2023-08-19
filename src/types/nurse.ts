/* eslint-disable @typescript-eslint/no-unused-vars */
type DayShift = {
  /** 날짜 */
  day: Day;
  /** 근무 형태종류 */
  shiftId: number;
};

type Nurse = {
  /** 간호사 id */
  nurseId: number;
  /** 계정 id */
  accountId: number | null;
  /** 병동 id */
  wardId: number;
  /** 간호 조무사 */
  isAssistant: boolean;
  /** 간호사 이름 */
  name: string;
  /** 간호사 전화번호 */
  phoneNum: string | null;
  /** 간호사 연동 여부 */
  isConnected: boolean;
  /** 근무 리스트 */
  nurseShiftTypes: {
    nurseShiftTypeId: number;
    name: string;
    shortName: string;
    isPossible: boolean;
    isPreferred: boolean;
  }[];
  /**근무표에 들어가는 사람인가? */
  isWorker: boolean;
  /**근무표 제작 권한 */
  isDutyManager: boolean;
  /**병동 관리 권한 */
  isWardManager: boolean;
  /**성별 */
  gender: string;
  /**입사날짜 */
  employmentDate: string;
  workStartDate: string;
  workEndDate: string;
  memo: string;
  isDeleted: boolean;
};
