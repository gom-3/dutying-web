/* eslint-disable @typescript-eslint/no-unused-vars */
type DayDuty = {
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
  phoneNumber: string | null;
  /** 간호사 숙련도
   * @example
   * 숙련도 구분이 3일 때
   * 1 : 액팅 간호사(1-2년차)
   * 2 : 서브 차지 간호사(3-5년차)
   * 3 : 차지 간호사(5년 이상)
   * */
  level: number;
  /** 간호사 연동 여부 */
  connStatus: boolean;
  /** 가능한 근무 리스트
   * @example
   * {...
   * workAvailable: [shiftList[1], shiftList[3]],
   * ...
   * }
   * shiftList: Shift[] 근무 유형 배열
   */
  nurseShiftTypes: {
    nurseShiftTypeId: number;
    name: string;
    abbr: string;
    isPossible: boolean;
    isPrefer: boolean;
  }[];
  workRequest: DayDuty[];
  /** 간호사 특성
   * @example 임산부, 연차 사용 선호 등
   */
  trait: string[];
  /** 주말 오프 누적 카운트 */
  accWeekendOff: number;
};
