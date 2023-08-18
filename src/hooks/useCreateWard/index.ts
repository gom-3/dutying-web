import { useEffect } from 'react';
import useCreateWardStore from './store';
import { shallow } from 'zustand/shallow';
import { CreateShiftTypeDTO } from '@libs/api/shift';
import { CreateWardDTO } from '@libs/api/ward';

const useCreateWard = () => {
  const [steps, currentStep, createWardDTO, shiftTypes, isFilled, error, setState] =
    useCreateWardStore(
      (state) => [
        state.steps,
        state.currentStep,
        state.createWardDTO,
        state.shiftTypes,
        state.isFilled,
        state.error,
        state.setState,
      ],
      shallow
    );

  useEffect(() => {
    if (Object.values(createWardDTO).includes('')) {
      setState('isFilled', false);
      setState('error', { currentStep, message: '빈 값을 채워주세요' });
      return;
    } else {
      setState('isFilled', true);
      setState('error', null);
    }
  }, [createWardDTO, currentStep]);

  return {
    state: {
      steps,
      currentStep,
      createWardDTO,
      shiftTypes,
      isFilled,
      error,
    },
    actions: {
      changeCurrentStep: (step: number) => setState('currentStep', step),
      changeWard: (key: keyof CreateWardDTO, value: string | number) => {
        setState('createWardDTO', { ...createWardDTO, [key]: value });
      },
      changeShiftTypes: (shiftTypes: CreateShiftTypeDTO[]) => setState('shiftTypes', shiftTypes),
    },
  };
};

export default useCreateWard;
