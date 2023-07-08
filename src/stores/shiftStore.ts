import { shiftList } from '@mocks/duty/data';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** 근무 종류 전역 상태 */
interface ShiftState {
  /**근무 유형 목록 */
  shiftList: ShiftList;
  /**근무 유형 수정 */
  setShiftList: (shiftList: ShiftList) => void;
}

export const useShiftStore = create<ShiftState>()(
  devtools(
    persist(
      (set) => ({
        shiftList: shiftList,
        setShiftList: (shiftList) => set((state) => ({ ...state, shiftList: shiftList })),
      }),
      {
        name: 'shift-storage',
      }
    )
  )
);

export const useShiftList = () => useShiftStore((state) => state.shiftList);
