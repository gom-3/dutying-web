import { useEffect } from 'react';
import useCreateWardStore from './store';
import { shallow } from 'zustand/shallow';

const useCreateWard = () => {
  const [steps, currentStep, ward, shiftTypes, isFilled, error, setState] = useCreateWardStore(
    (state) => [
      state.steps,
      state.currentStep,
      state.ward,
      state.shiftTypes,
      state.isFilled,
      state.error,
      state.setState,
    ],
    shallow
  );

  useEffect(() => {
    if (Object.values(ward).includes('')) {
      setState('isFilled', false);
      setState('error', { currentStep, message: '빈 값을 채워주세요' });
      return;
    } else {
      setState('isFilled', true);
      setState('error', null);
    }
  }, [ward, currentStep]);

  return {
    state: {
      steps,
      currentStep,
      ward,
      shiftTypes,
      isFilled,
      error,
    },
    actions: {
      changeCurrentStep: (step: number) => setState('currentStep', step),
      changeWard: (key: keyof CreateWardRequestDTO, value: string | number) => {
        setState('ward', { ...ward, [key]: value });
      },
      changeShiftTypes: (shiftTypes: CreateShiftTypesRequestDTO) =>
        setState('shiftTypes', shiftTypes),
    },
  };
};

export default useCreateWard;
