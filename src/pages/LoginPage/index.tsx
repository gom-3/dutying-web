import { FullLogo, KakaoIcon, LogoSymbolFill } from '@assets/svg';

const LoginPage = () => {
  return (
    <div className="bg- flex w-screen justify-center">
      <div className="flex h-screen w-[100vh] flex-col items-center justify-between bg-white p-[4.5rem]">
        <div className="flex">
          <LogoSymbolFill className="mr-[2.3438rem] h-[3.125rem] w-[2.9688rem]" />
          <FullLogo className="h-[3.125rem] w-[11.3125rem]" />
        </div>
        <div className="relative">
          <div className="absolute top-[-4.3rem] font-apple text-[2rem] text-sub-2">로그인</div>
          <a
            href="http://54.180.65.130:8080/oauth2/authorization/kakao"
            className="flex h-[7.625rem] w-[40rem] items-center justify-center rounded-[1.25rem] border border-sub-4 shadow-shadow-1"
          >
            <KakaoIcon className="mr-[3.125rem] h-[4rem] w-[4rem]" />
            <div className="font-apple text-[1.7rem] text-sub-1">카카오로 3초 만에 시작하기</div>
          </a>
        </div>
        <div className="flex">
          <div className="mr-[3.125rem] font-apple text-[1.5rem] text-sub-2.5">
            아직 듀팅을 시작하지 않으셨나요?
          </div>
          <div className="font-apple text-[1.5rem] text-main-2 underline">회원가입</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
