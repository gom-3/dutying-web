import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** 병동 설정 전역상태 */
interface WardState {
  /**병동 id */
  wardId: number;
  /**병동 이름 */
  name: string;
  /**병원 이름 */
  hospitalName: string;
  /**간호사 수 */
  nuresCount: number;
  /**입장 코드 */
  code: string;
  /**숙련도 구분 */
  levelDivision: number;
  /**교대 수 */
  rotationNum: number;
  /**최대 연속 근무 */
  maxContinuosWork: number;
  /**최대 연속 나이트 */
  maxContinuosNight: number;
  /**최소 나이트 간격 */
  minNightInterval: number;
  /**숙련도 구분 수정 */
  setLevelDivision: (division: number) => void;
  /**최대 연속 근무 수 수정 */
  setMaxContinuosWork: (count: number) => void;
  /**최대 연속 나이트 수 수정 */
  setMaxContinuosNight: (count: number) => void;
  /**최소 나이트 간격 수정 */
  setMinNightInterval: (interval: number) => void;
  /**병동 전체 PUT */
  setWard: (ward: WardState) => void;
}

export const useWardStore = create<WardState>()(
  devtools(
    persist(
      (set) => ({
        wardId: 0,
        name: '곰세마리',
        hospitalName: '',
        nuresCount: 0,
        code: '',
        levelDivision: 3,
        rotationNum: 3,
        maxContinuosWork: 5,
        maxContinuosNight: 3,
        minNightInterval: 7,
        setLevelDivision: (division) =>
          set((state) => ({
            ...state,
            levelDivision: division,
          })),
        setMaxContinuosWork: (count) =>
          set((state) => ({
            ...state,
            maxContinuosWork: count,
          })),
        setMaxContinuosNight: (count) =>
          set((state) => ({
            ...state,
            maxContinuosNight: count,
          })),
        setMinNightInterval: (interval) =>
          set((state) => ({
            ...state,
            minNightInterval: interval,
          })),
        setWard: (ward) => set(ward),
      }),
      {
        name: 'ward-storage',
      }
    )
  )
);
