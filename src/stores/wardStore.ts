import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** 병동 설정 전역상태 */
interface WardState {
  /**병동 이름 */
  name: string;
  /**병원 이름 */
  hospitalName: string;
  /**간호사 수 */
  nuresCount: number;
  /**입장 코드 */
  code: string;
  /**숙련도 구분 */
  levelType: number;
  /**교대 수 */
  rotation: number;
  /**최대 연속 근무 */
  maxContinuosShift: number;
  /**최대 연속 나이트 */
  maxContinuosNight: number;
  /**최소 나이트 간격 */
  minNightInterval: number;
  actions: {
    /**최대 연속 근무 수 수정 */
    setMaxContinuosShift: (count: number) => void;
    /**최대 연속 나이트 수 수정 */
    setMaxContinuosNight: (count: number) => void;
    /**최소 나이트 간격 수정 */
    setMinNightInterval: (interval: number) => void;
  };
}

export const useWardStore = create<WardState>()(
  devtools(
    persist(
      (set) => ({
        name: '',
        hospitalName: '',
        nuresCount: 0,
        code: '',
        levelType: 3,
        rotation: 3,
        maxContinuosShift: 5,
        maxContinuosNight: 3,
        minNightInterval: 7,
        actions: {
          setMaxContinuosShift: (count) =>
            set((state) => ({
              ...state,
              maxContinuosShift: count,
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
        },
      }),
      {
        name: 'ward-storage',
      }
    )
  )
);

