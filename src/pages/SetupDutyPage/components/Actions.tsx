import { Step } from './useSetupDuty';

interface Props {
  step: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

function Actions({ step, currentStep, setCurrentStep }: Props) {
  return (
    <div className="flex w-[76%] justify-end gap-4">
      {currentStep !== 0 && (
        <button
          className="h-[80px] w-[183px] rounded-[50px] border-2 border-main-1 font-apple text-[36px] font-medium text-main-1"
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          이전
        </button>
      )}
      {currentStep !== step.length - 1 && (
        <button
          className="h-[80px] w-[183px] rounded-[50px]  bg-main-1 font-apple text-[36px] font-medium text-white"
          onClick={() => setCurrentStep(currentStep + 1)}
        >
          다음
        </button>
      )}
    </div>
  );
}

export default Actions;
