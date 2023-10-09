import { FullLogo, LogoSymbolFill } from '@assets/svg';
import { match } from 'ts-pattern';
import RegisterNurse from './components/RegisterNurse';
import { TailSpin } from 'react-loader-spinner';
import useAuth from '@hooks/auth/useAuth';
import PendingEnter from './components/PendingEnter';
import { Navigate, useNavigate } from 'react-router';
import SelectEnterOrCreate from './components/SelectEnterOrCreate';
import ROUTE from '@libs/constant/path';

function RegisterPage() {
  const {
    state: { accountMe },
  } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto mt-[7.6875rem] flex h-[calc(100%-7.6875rem)] w-[52%] flex-col items-center bg-[#FDFCFE]">
      <div
        className="fixed left-[3.125rem] top-[1.875rem] flex cursor-pointer gap-[1.25rem]"
        onClick={() => navigate(ROUTE.ROOT)}
      >
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      {match(accountMe?.status)
        .with('INITIAL', 'NURSE_INFO_PENDING', () => <RegisterNurse />)
        .with('WARD_SELECT_PENDING', () => <SelectEnterOrCreate />)
        .with('WARD_ENTRY_PENDING', () => <PendingEnter />)
        .with('LINKED', () => <Navigate to={ROUTE.MAKE} />)
        .otherwise(() => (
          <div className="flex h-screen w-screen flex-col items-center justify-center">
            <TailSpin color="#844AFF" />
          </div>
        ))}
    </div>
  );
}

export default RegisterPage;
