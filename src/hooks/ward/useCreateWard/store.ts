/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';
import { CreateWardDTO } from '@libs/api/ward';
import { CreateShiftTypeDTO } from '@libs/api/shiftType';

interface State {
  steps: string[];
  currentStep: number;
  createWardDTO: CreateWardDTO;
  shiftTypes: CreateShiftTypeDTO[];
  isFilled: boolean;
  error: CreateWardRequestDTOValidationError;
}

interface Store extends State {
  setState: (key: keyof State, value: any) => void;
}

const initialState: State = {
  steps: ['1 병동 • 간호사 정보', '2 숙련도 구분', '3 연속 근무', '4 근무 형태'],
  currentStep: 0,
  createWardDTO: {
    name: '',
    hospitalName: '',
  },
  shiftTypes: [
    {
      name: '오프',
      shortName: 'O',
      startTime: '00:00',
      endTime: '00:00',
      isOff: true,
      color: '#465B7A',
    },
    {
      name: '데이',
      shortName: 'D',
      startTime: '07:00',
      endTime: '15:00',
      isOff: false,
      color: '#4DC2AD',
    },
    {
      name: '이브닝',
      shortName: 'E',
      startTime: '15:00',
      endTime: '23:00',
      isOff: false,
      color: '#FF8BA5',
    },
    {
      name: '나이트',
      shortName: 'N',
      startTime: '23:00',
      endTime: '07:00',
      isOff: false,
      color: '#3580FF',
    },
  ],
  isFilled: false,
  error: null,
};

const useCreateWardStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setState: (key, value) =>
          set(
            produce(get(), (draft: any) => {
              draft[key] = value;
            })
          ),
      }),
      {
        name: 'useCreateWardStore',
      }
    )
  )
);

export default useCreateWardStore;
