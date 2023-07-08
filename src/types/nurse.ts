/* eslint-disable @typescript-eslint/no-unused-vars */
type DayDuty = {
  /** 날짜 */
  day: Day;
  /** 근무 형태종류 */
  shiftId: number;
};

type Account = {
  accountId: number;
  /** 연동된 간호사 ID */
  nurseId: number | null;
  /** 소속된 병동 ID */
  wardId: number | null;
  email: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  /** 계정 삭제 여부 */
  isDeleted: boolean;
  /** 교대근무에 참여하는가? */
  isWorker: boolean;
  /** 계정의 상태 */
  status: 'ONBOARDING' | 'GUIDE' | 'NURSE' | 'MANAGER';
  phoneNum: string;
  gender: string;
  birthday: string;
  /** 입사 날짜 */
  employmentDate: string;
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
  /** 간호사 숙련도
   * @example
   * 숙련도 구분이 3일 때
   * 1 : 액팅 간호사(1-2년차)
   * 2 : 서브 차지 간호사(3-5년차)
   * 3 : 차지 간호사(5년 이상)
   * */
  level: number;
  /** 간호사 연동 여부 */
  isConnected: boolean;
  /** 근무 리스트 */
  nurseShiftTypes: {
    nurseShiftTypeId: number;
    name: string;
    shoftName: string;
    isPossible: boolean;
    isPreferred: boolean;
  }[];
  /**근무표 제작 권한 */
  isDutyManager: boolean;
  /**병동 관리 권한 */
  isWardManager: boolean;
  /**성별 */
  gender: string;
  /**입사날짜 */
  employmentDate: string;
};

type RequestDuty = Omit<Duty, 'dutyRowsByLevel'> & {
  requestRowsByLevel: Array<{
    level: number;
    dutyRows: Array<DutyRow>;
  }>;
};
