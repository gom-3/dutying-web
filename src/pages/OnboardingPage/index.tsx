import { FullLogo, LogoSymbolFill } from '@assets/svg';
import Actions from './components/Actions';
import Stepper from './components/Stepper';
import useSetupDuty from './components/useSetupDuty';

function OnboardingPage() {
  const { steps, currentStep, setCurrentStep } = useSetupDuty();

  return (
    <div className="mx-auto flex h-full w-[70%] flex-col items-center bg-[#FDFCFE] pt-[13.3125rem]">
      <div className="fixed left-[3.125rem] top-[1.875rem] flex gap-[1.25rem]">
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      <Stepper steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="mt-[1.875rem] min-h-[22rem] w-full rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
        {steps[currentStep].contents}
      </div>
      <Actions steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  );
}

export default OnboardingPage;
