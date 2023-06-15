import { shiftKindList } from '@mocks/duty/data';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/** Shift의 종류를 전역상태로 관리 */
interface ShiftState {
  rotation: number;
  shifts: ShiftKind[];
  action: {
    /**기존의 근무 유형 수정 */
    changeShift: (id: number, newShift: ShiftKind) => void;
    /**새로운 근무 유형 추가 */
    addShift: (shift: ShiftKind) => void;
    /**기존의 근무 유형 삭제 */
    deleteShift: (id: number) => void;
  };
}

const useShiftStore = create<ShiftState>()(
  devtools(
    persist(
      (set) => ({
        rotation: 3,
        shifts: shiftKindList,
        action: {
          changeShift: (id, newShift) =>
            set((state) => ({
              ...state,
              shifts: state.shifts.map((shift) => (shift.id === id ? newShift : shift)),
            })),
          addShift: (shift) => set((state) => ({ shifts: [...state.shifts, shift] })),
          deleteShift: (id) =>
            set((state) => ({
              ...state,
              shifts: state.shifts.filter((shift) => shift.id !== id),
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
export const useShiftKind = () => useShiftStore((state) => state.shifts);
export const useShiftAction = () => useShiftStore((state) => state.action);
