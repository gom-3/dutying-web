/* eslint-disable @typescript-eslint/no-unused-vars */
type Ward = {
  /** 병동 id */
  wardId: number;
  /** 병동 이름 */
  name: string;
  /** 병원 이름 */
  hospitalName: string;
  /** 병상 수 */
  bedCnt: number;
  /** 간호사 수 */
  nurseCnt: number;
  /** SHA-256 해싱한 병동 고유 코드 */
  code: string;
  /** 교대 수 @example 2, 3, 4 */
  rotationNum: number;
  /** 일반 연속 근무 제한
   * @example 5이면 연속으로 5일 이상 근무 제한 */
  maxContinuousWork: number;
  /** 나이트 연속 근무 제한
   * @example 3이면 연속으로 3일 이상 나이트 근무 제한 */
  maxContinuousNight: number;
  /** 나이트 간격
   * @example 7이면 전 나이트 근무에서 7일 이후에 다시 나이트 근무 가능 */
  minNightInterval: number;
  /** 숙련도 구분 수 @example 3~6 */
  levelDivision: number;
};

