import { shiftList } from '@mocks/duty/data';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** Shift의 종류를 전역상태로 관리 */
interface ShiftState {
  rotation: number;
  shiftList: ShiftList;
  action: {
    /**기존의 근무 유형 수정 */
    changeShift: (id: number, newShift: Shift) => void;
    /**새로운 근무 유형 추가 */
    addShift: (shift: Shift) => void;
    /**기존의 근무 유형 삭제 */
    deleteShift: (id: number) => void;
  };
}

const useShiftStore = create<ShiftState>()(
  devtools(
    persist(
      (set) => ({
        rotation: 3,
        shiftList: shiftList,
        action: {
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

export const useShiftRotation = () => useShiftStore((state) => state.rotation);
export const useShiftList = () => useShiftStore((state) => state.shiftList);
export const useShiftAction = () => useShiftStore((state) => state.action);
