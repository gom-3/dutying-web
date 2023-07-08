import Button from '@components/Button';
import { Step } from './useCreateWard';
import { useNavigate } from 'react-router';

interface Props {
  steps: Step[];
  currentStep: number;
  isFilled: boolean;
  setCurrentStep: (step: number) => void;
}

function Actions({ steps, currentStep, isFilled, setCurrentStep }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mt-[3.4375rem] flex w-full justify-end gap-4 pb-[4.6875rem]">
      {currentStep !== 0 && (
        <Button
          type="outline"
          className="h-[5rem] w-[11.4375rem] "
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          이전
        </Button>
      )}
      {currentStep !== steps.length - 1 ? (
        <Button
          className="h-[5rem] w-[11.4375rem]"
          disabled={!isFilled}
          onClick={() => setCurrentStep(currentStep + 1)}
        >
          다음
        </Button>
      ) : (
        <Button className="h-[5rem] w-[11.4375rem]" onClick={() => navigate('/')}>
          저장
        </Button>
      )}
    </div>
  );
}

export default Actions;
