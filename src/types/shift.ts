/** 근무 형태 타입 */
type Shift = {
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
  /** 근무 입력 단축키 @example ['D', 'd', 'ㅇ', '1']*/
  hotKey: Array<string>;
  /** 근무 표시 색상 */
  color: string;
  /** 기본 값 여부 (D,E,N,O 인지) */
  isDefault: boolean;
  /** 휴가 여부 */
  isOff: boolean;
};