import { mockShiftTypeList } from '@mocks/shift';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** 근무 종류 전역 상태 */
interface ShiftState {
  /**근무 유형 목록 */
  shiftTypeList: WardShiftType[];
  /**근무 유형 수정 */
  setShiftTypeList: (shiftTypeList: WardShiftType[]) => void;
}

export const useShiftStore = create<ShiftState>()(
  devtools(
    persist(
      (set) => ({
        shiftTypeList: mockShiftTypeList,
        setShiftTypeList: (shiftTypeList) => set((state) => ({ ...state, shiftTypeList })),
      }),
      {
        name: 'shift-storage',
      }
    )
  )
);

export const useShiftTypeList = () => useShiftStore((state) => state.shiftTypeList);
