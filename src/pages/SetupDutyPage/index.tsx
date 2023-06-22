import Stepper from './components/Stepper';
import Actions from './components/Actions';
import useSetupDuty from './components/useSetupDuty';

function SetupDutyPage() {
  const { step, currentStep, setCurrentStep } = useSetupDuty();

  return (
    <div className="flex h-full w-full flex-col items-center bg-[#FDFCFE] pt-[5.75rem]">
      <Stepper step={step} currentStep={currentStep} setCurrentStep={setCurrentStep} />
      {step[currentStep].contents}
      {step[currentStep].description}
      <Actions step={step} currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  );
}

export default SetupDutyPage;
