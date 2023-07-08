import { shiftList } from '@mocks/duty/data';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** 근무 종류 전역 상태 */
interface ShiftState {
  /**근무 유형 목록 */
  shiftList: ShiftList;
  actions: {
    /**기존의 근무 유형 수정 */
    changeShift: (id: number, newShift: Shift) => void;
    /**새로운 근무 유형 추가 */
    addShift: (shift: Shift) => void;
    /**기존의 근무 유형 삭제 */
    deleteShift: (id: number) => void;
  };
}

export const useShiftStore = create<ShiftState>()(
  devtools(
    persist(
      (set) => ({
        shiftList: shiftList,
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
        },
      }),
      {
        name: 'shift-storage',
      }
    )
  )
);

export const useShiftList = () => useShiftStore((state) => state.shiftList);
export const useShiftAction = () => useShiftStore((state) => state.actions);
