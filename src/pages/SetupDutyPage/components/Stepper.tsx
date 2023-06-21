import { Step } from './useSetupDuty';

interface Props {
  step: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

function Stepper({ step, currentStep, setCurrentStep }: Props) {
  return (
    <div className="flex w-[85%]">
      {step.map((item, index) => {
        const isActive = currentStep === index;

        return (
          <div
            key={index}
            className="relative flex flex-1 cursor-pointer flex-col items-center justify-end gap-3"
            onClick={() => setCurrentStep(index)}
          >
            {index !== 0 && (
              // 스탭 사이의 실선입니다.
              <div className={`absolute bottom-[25px] left-[-50%] h-[3px] w-full bg-sub-4 `} />
            )}
            <p
              className={`font-apple font-medium ${
                isActive ? 'text-[32px] text-main-1 ' : 'text-[20px] text-sub-3'
              }`}
            >
              {item.name}
            </p>
            <div
              className={`z-[1] flex h-[50px] w-[50px] items-center justify-center rounded-full border-[1.5px] border-sub-4 bg-[#F2F2F7] font-poppins text-[32px] ${
                isActive ? 'border-main-1 bg-[#FDFCFE] text-main-1' : 'text-sub-3'
              }`}
            >
              {index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;
