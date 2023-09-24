import { FullLogo, LogoSymbolFill } from '@assets/svg';
import { useState } from 'react';
import { match } from 'ts-pattern';

function SignupPage() {
  const [status, setStatus] = useState<Account['onboardingStatus']>('INITIAL'); // 추후 Account 상태로 변경
  return (
    <div className="mx-auto flex h-full w-[52%] flex-col items-center bg-[#FDFCFE] pt-[7.6875rem]">
      <div className="fixed left-[3.125rem] top-[1.875rem] flex gap-[1.25rem]">
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      {match(status)
        .with('INITIAL', () => <div>as</div>)
        .with('NURSE_INFO_PENDING', () => <div>as</div>)
        .with('WARD_SELECT_PENDING', () => <div>as</div>)
        .with('WARD_ENTRY_PENDING', () => <div>as</div>)
        .with('LINKED', () => <div>as</div>)
        .exhaustive()}
    </div>
  );
}

export default SignupPage;
