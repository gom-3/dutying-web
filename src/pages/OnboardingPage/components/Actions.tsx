import Button from '@components/Button';
import { Step } from './useSetupDuty';
import { useNavigate } from 'react-router';

interface Props {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

function Actions({ steps, currentStep, setCurrentStep }: Props) {
  const navigate = useNavigate();
  return (
    <div className="mt-[3.4375rem] flex w-full justify-end gap-4">
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
          className="h-[5rem] w-[11.4375rem] bg-main-3"
          onClick={() => setCurrentStep(currentStep + 1)}
        >
          다음
        </Button>
      ) : (
        <Button className="h-[5rem] w-[11.4375rem] bg-main-3" onClick={() => navigate('/')}>
          저장
        </Button>
      )}
    </div>
  );
}

export default Actions;
