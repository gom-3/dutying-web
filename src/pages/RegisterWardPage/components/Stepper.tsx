import useCreateWard from '@hooks/useCreateWard';

function Stepper() {
  const {
    state: { currentStep, steps, isFilled },
    actions: { changeCurrentStep },
  } = useCreateWard();
  return (
    <div className="flex w-full gap-[.5625rem]">
      {steps.map((item, index) => {
        const isActive = currentStep === index;
        const isFinished = currentStep > index;

        return (
          <div
            key={index}
            className={`flex h-[3.125rem] flex-1 items-center rounded-[.625rem] border-[.0938rem] px-[20px] py-[10px] font-apple text-[1.25rem] font-bold ${
              isActive
                ? 'border-main-1 bg-main-1 text-white'
                : isFinished
                ? 'border-main-2 bg-main-2 text-white'
                : 'border-sub-4 bg-[#F2F2F7] text-sub-3'
            }`}
            onClick={() => isFilled && changeCurrentStep(index)}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;
