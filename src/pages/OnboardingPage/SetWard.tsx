import { FullLogo, LogoSymbolFill } from '@assets/svg';
import Actions from './components/Actions';
import Stepper from './components/Stepper';
import useCreateWard from './components/useCreateWard';

function SetWard() {
  const { steps, currentStep, isFilled, setCurrentStep } = useCreateWard();

  return (
    <div className="mx-auto flex h-full w-[70%] flex-col items-center bg-[#FDFCFE] pt-[7.6875rem]">
      <div className="fixed left-[3.125rem] top-[1.875rem] flex gap-[1.25rem]">
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      <h1 className="mb-[2.8125rem] self-start font-apple text-[2rem] font-semibold text-[#150B3C]">
        근무 설정
      </h1>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isFilled={isFilled}
      />
      <div className="mt-[1.875rem] min-h-[22rem] w-full shrink-0 rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
        {steps[currentStep].contents}
      </div>
      <Actions
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isFilled={isFilled}
      />
    </div>
  );
}

export default SetWard;
