import { TailSpin } from 'react-loader-spinner';
import { Navigate, useNavigate } from 'react-router';
import { match } from 'ts-pattern';
import { FullLogo, LogoSymbolFill } from '@assets/svg';
import useAuth from '@hooks/auth/useAuth';
import ROUTE from '@libs/constant/path';
import PendingEnter from './components/PendingEnter';
import RegisterNurse from './components/RegisterNurse';
import SelectEnterOrCreate from './components/SelectEnterOrCreate';

function RegisterPage() {
  const {
    state: { accountMe },
  } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto mt-[7.6875rem] flex h-[calc(100%-7.6875rem)] w-[52%] flex-col items-center bg-main-bg">
      <div className="fixed left-[3.125rem] top-[1.875rem] flex cursor-pointer gap-5" onClick={() => navigate(ROUTE.ROOT)}>
        <LogoSymbolFill className="size-[1.875rem]" />
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
