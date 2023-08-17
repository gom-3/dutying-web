import { FullLogo, LogoSymbolFill } from '@assets/svg';
import Actions from './components/Actions';
import useCreateWard from '@hooks/useRequestShift/useCreateWard';
import { match } from 'ts-pattern';
import SetWard from './components/SetWard';
import Stepper from './components/Stepper';
import SetDivision from './components/SetDivision';
import SetStraight from './components/SetStraight';
import SetShift from './components/SetShift';

function RegisterWardPage() {
  const {
    state: { currentStep },
  } = useCreateWard();

  return (
    <div className="mx-auto flex h-full w-[70%] flex-col items-center bg-[#FDFCFE] pt-[7.6875rem]">
      <div className="fixed left-[3.125rem] top-[1.875rem] flex gap-[1.25rem]">
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      <h1 className="mb-[2.8125rem] self-start font-apple text-[2rem] font-semibold text-[#150B3C]">
        근무 설정
      </h1>
      <Stepper />
      <div className="mt-[1.875rem] min-h-[22rem] w-full shrink-0 rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
        {match(currentStep)
          .with(0, () => <SetWard />)
          .with(1, () => <SetDivision />)
          .with(2, () => <SetStraight />)
          .with(3, () => <SetShift />)
          .otherwise(() => null)}
      </div>
      <Actions />
    </div>
  );
}

export default RegisterWardPage;
