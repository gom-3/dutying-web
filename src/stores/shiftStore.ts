import { shiftList } from '@mocks/duty/data';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** 근무 설정 전역상태 */
interface ShiftState {
  /**교대 수 */
  rotation: number;
  /**근무 유형 목록 */
  shiftList: ShiftList;
  /**최대 연속 근무 */
  maxContinuosShift: number;
  /**최대 연속 나이트 */
  maxContinuosNight: number;
  /**최소 나이트 간격 */
  minNightInterval: number;
  actions: {
    /**기존의 근무 유형 수정 */
    changeShift: (id: number, newShift: Shift) => void;
    /**새로운 근무 유형 추가 */
    addShift: (shift: Shift) => void;
    /**기존의 근무 유형 삭제 */
    deleteShift: (id: number) => void;
    /**최대 연속 근무 수 수정 */
    setMaxContinuosShift: (count: number) => void;
    /**최대 연속 나이트 수 수정 */
    setMaxContinuosNight: (count: number) => void;
    /**최소 나이트 간격 수정 */
    setMinNightInterval: (interval: number) => void;
  };
}

export const useShiftStore = create<ShiftState>()(
  devtools(
    persist(
      (set) => ({
        rotation: 3,
        shiftList: shiftList,
        maxContinuosShift: 5,
        maxContinuosNight: 3,
        minNightInterval: 7,
        actions: {
          changeShift: (index, newShift) =>
            set((state) => ({
              ...state,
              shiftList: state.shiftList.map((shift, i) => (i === index ? newShift : shift)),
            })),
          addShift: (shift) => set((state) => ({ shiftList: [...state.shiftList, shift] })),
          deleteShift: (index) =>
            set((state) => ({
              ...state,
              shiftList: state.shiftList.filter((_, i) => i !== index),
            })),
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
        name: 'shift-storage',
      }
    )
  )
);

export const useShiftRotation = () => useShiftStore((state) => state.rotation);
export const useShiftList = () => useShiftStore((state) => state.shiftList);
export const useShiftAction = () => useShiftStore((state) => state.actions);
