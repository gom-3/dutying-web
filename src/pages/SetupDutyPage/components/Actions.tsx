import Button from '@components/Button';
import { Step } from './useSetupDuty';

interface Props {
  step: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

function Actions({ step, currentStep, setCurrentStep }: Props) {
  return (
    <div className="mt-[3.4375rem] flex w-[76%] justify-end gap-4">
      {currentStep !== 0 && (
        <Button
          type="outline"
          className="h-[5rem] w-[11.4375rem] "
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          이전
        </Button>
      )}
      {currentStep !== step.length - 1 && (
        <Button
          className="h-[5rem] w-[11.4375rem] bg-main-3"
          onClick={() => setCurrentStep(currentStep + 1)}
        >
          다음
        </Button>
      )}
    </div>
  );
}

export default Actions;
