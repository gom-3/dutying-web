import Button from '@components/Button';
import { useNavigate } from 'react-router';
import { HOME } from '@libs/constant/path';
import useCreateWard from '@hooks/useCreateWard';

function Actions() {
  const {
    state: { steps, currentStep, isFilled },
    actions: { changeCurrentStep },
  } = useCreateWard();
  const navigate = useNavigate();

  return (
    <div className="mt-[3.4375rem] flex w-full justify-end gap-4 pb-[4.6875rem]">
      {currentStep !== 0 && (
        <Button
          type="outline"
          className="h-[5rem] w-[11.4375rem] "
          onClick={() => changeCurrentStep(currentStep - 1)}
        >
          이전
        </Button>
      )}
      {currentStep !== steps.length - 1 ? (
        <Button
          className="h-[5rem] w-[11.4375rem]"
          disabled={!isFilled}
          onClick={() => changeCurrentStep(currentStep + 1)}
        >
          다음
        </Button>
      ) : (
        <Button className="h-[5rem] w-[11.4375rem]" onClick={() => navigate(HOME)}>
          저장
        </Button>
      )}
    </div>
  );
}

export default Actions;
