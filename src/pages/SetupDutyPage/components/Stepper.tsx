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
        const isFinished = currentStep > index;

        return (
          <div
            key={index}
            className="relative flex flex-1 cursor-pointer flex-col items-center justify-end gap-3"
            onClick={() => setCurrentStep(index)}
          >
            {index !== 0 && (
              // 스탭 사이의 실선입니다.
              <div
                className={`absolute bottom-[1.5625rem] left-[-50%] h-[.1875rem] w-full  ${
                  isFinished || isActive ? 'bg-main-1' : 'bg-sub-4'
                }`}
              />
            )}
            <p
              className={`line-clamp-1 font-apple ${
                isActive
                  ? 'text-[2rem] font-bold text-main-1'
                  : isFinished
                  ? 'text-[1.25rem] font-semibold text-main-1'
                  : 'text-[1.25rem] font-semibold text-sub-3'
              }`}
            >
              {item.name}
            </p>
            <div
              className={`z-[1] flex h-[3.125rem] w-[3.125rem] items-center justify-center rounded-full border-[.0938rem] font-poppins text-[2rem] ${
                isActive
                  ? 'border-main-1 bg-[#FDFCFE] text-main-1'
                  : isFinished
                  ? 'border-main-1 bg-main-1 text-[1.25rem] text-white'
                  : 'border-sub-4 bg-[#F2F2F7] text-sub-3'
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
