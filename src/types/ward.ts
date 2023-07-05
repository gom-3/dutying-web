/* eslint-disable @typescript-eslint/no-unused-vars */
type Ward = {
  /** 병원 이름 */
  hospitalName: string;
  /** 병동 이름 */
  wardName: string;
  /** 병상 수 */
  bedCnt: number;
  /** 간호사 수 */
  nurseCnt: number;
  /** 병동 코드 */
  code: string;
  /** 교대 수 @example 2, 3, 4 */
  rotation: number;
  /** 일반 연속 근무 제한
   * @example 5이면 연속으로 5일 이상 근무 제한 */
  straightNight: number;
  /** 나이트 연속 근무 제한
   * @example 3이면 연속으로 3일 이상 나이트 근무 제한 */
  straightNonNight: number;
  /** 나이트 간격
   * @example 7이면 전 나이트 근무에서 7일 이후에 다시 나이트 근무 가능 */
  nightInterval: number;
  /** 숙련도 구분 수 @example 3~6 */
  levelDivision: number;
};
