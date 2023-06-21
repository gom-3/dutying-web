/* eslint-disable @typescript-eslint/no-unused-vars */
type DayDuty = {
  /** 날짜 */
  day: Day;
  /** 근무 형태종류 */
  shiftId: number;
};

type Nurse = {
  /** 간호사 id */
  id: number;
  /** 간호사 이름 */
  name: string;
  /** 간호사 전화번호 */
  phone: string;
  /** 간호사 숙련도
   * @example
   * 숙련도 구분이 3일 때
   * 1 : 액팅 간호사(1-2년차)
   * 2 : 서브 차지 간호사(3-5년차)
   * 3 : 차지 간호사(5년 이상)
   * */
  proficiency: number;
  /** 간호사 연동 여부 */
  isConnected: boolean;
  /** 가능한 근무 리스트
   * @example
   * {...
   * workAvailable: [shiftKindList[1], shiftKindList[3]],
   * ...
   * }
   * shiftKindList: ShiftKind[] 근무 유형 배열
   */
  workAvailable: ShiftKind[];
  /** 가능한 근무 리스트
   * @example
   * {...
   * workPrefer: [shiftKindList[1], shiftKindList[3]],
   * ...
   * }
   * shiftKindList: ShiftKind[] 근무 유형 배열
   */
  workPrefer: ShiftKind[];
  /** 신청 근무 날짜 및 근무 유형 리스트*/
  workRequest: DayDuty[];
  /** 간호사 특성
   * @example 임산부, 연차 사용 선호 등
   */
  trait: string[];
  /** 주말 오프 누적 카운트 */
  accWeekendOff: number;
};
