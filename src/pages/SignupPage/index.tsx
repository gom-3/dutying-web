import { FullLogo, LogoSymbolFill } from '@assets/svg';
import { match } from 'ts-pattern';
import SetNurseForm from './components/SetNurseForm';
import { TailSpin } from 'react-loader-spinner';
import useAuth from '@hooks/useAuth';

function SignupPage() {
  const {
    state: { accountMe },
  } = useAuth();

  return (
    <div className="mx-auto flex h-full w-[52%] flex-col items-center bg-[#FDFCFE] pt-[7.6875rem]">
      <div className="fixed left-[3.125rem] top-[1.875rem] flex gap-[1.25rem]">
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      {match(accountMe?.status)
        .with('INITIAL', () => <SetNurseForm />)
        .with('NURSE_INFO_PENDING', () => <SetNurseForm />)
        .with('WARD_SELECT_PENDING', () => <div>as</div>)
        .with('WARD_ENTRY_PENDING', () => <div>as</div>)
        .with('LINKED', () => <div>as</div>)
        .otherwise(() => (
          <div className="flex h-screen w-screen flex-col items-center justify-center">
            <TailSpin color="#844AFF" />
          </div>
        ))}
    </div>
  );
}

export default SignupPage;
