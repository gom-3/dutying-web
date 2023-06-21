import Stepper from './components/Stepper';
import Actions from './components/Actions';
import useSetupDuty from './components/useSetupDuty';

function SetupDutyPage() {
  const { step, currentStep, setCurrentStep } = useSetupDuty();

  return (
    <div className="flex h-full w-full flex-col items-center bg-[#FDFCFE] pt-[92px]">
      <Stepper step={step} currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="mt-[50px] h-[352px] w-[76%] rounded-[20px] bg-white shadow-[0px_4px_34px_#EDE9F5]">
        {step[currentStep].contents}
      </div>
      <div className="mb-[55px] mt-[30px] h-[194px] w-[76%] rounded-[20px] bg-[#EDE4FF] shadow-[0px_4px_34px_#EDE9F5]">
        {step[currentStep].description}
      </div>
      <Actions step={step} currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  );
}

export default SetupDutyPage;
