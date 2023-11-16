import {
  AppleIcon,
  BackCircle,
  FullLogo,
  KakaoIcon,
  LogoSymbolFill,
  NextCircle,
} from '@assets/svg';
import ROUTE from '@libs/constant/path';
import { useNavigate } from 'react-router';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './index.css';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-screen">
      <div className="hidden h-screen w-[calc(100vh/1080*1140)] min-w-0 shrink xl:block">
        <Carousel
          // autoPlay
          infiniteLoop
          dynamicHeight
          stopOnHover
          showArrows
          showIndicators={false}
          showThumbs={false}
          statusFormatter={(current, total) => `${current} / ${total}`}
          renderArrowPrev={(click) => (
            <BackCircle
              className="absolute left-[5rem] top-[50%] z-10 h-[3.25rem] w-[3.25rem] translate-y-[-50%] cursor-pointer"
              onClick={click}
            />
          )}
          renderArrowNext={(click) => (
            <NextCircle
              className="absolute right-[5rem] top-[50%] z-10 h-[3.25rem] w-[3.25rem] translate-y-[-50%] cursor-pointer"
              onClick={click}
            />
          )}
        >
          <div className='h-screen w-full min-w-[1px] bg-[url("/img/login_1.webp")] bg-cover bg-center'></div>
          <div className='h-screen w-full min-w-[1px] bg-[url("/img/login_2.webp")] bg-cover bg-center'></div>
          <div className='h-screen w-full min-w-[1px] bg-[url("/img/login_3.webp")] bg-cover bg-center'></div>
        </Carousel>
      </div>
      <div className="z-10 flex h-screen min-w-[48.75rem] flex-1 shrink-0 flex-col items-center justify-between bg-white px-[6.5625rem] pb-[6.25rem] pt-[8.75rem]">
        <div className="flex cursor-pointer" onClick={() => navigate(ROUTE.ROOT)}>
          <LogoSymbolFill className="mr-[2.3438rem] h-[3.125rem] w-[2.9688rem]" />
          <FullLogo className="h-[3.125rem] w-[11.3125rem]" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-apple text-[2rem] font-semibold text-text-1">로그인</h1>
          <a
            href={`${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/kakao?nextPageUrl=${
              location.origin
            }/make`}
            className="mt-[2.625rem] flex h-[6.25rem] w-[35.625rem] items-center justify-center rounded-[1.25rem] border bg-[#FEE500] shadow-banner"
          >
            <KakaoIcon className="mr-[3.125rem] h-[2.125rem] w-[2.25rem]" />
            <div className="font-apple text-[2rem] text-sub-1">카카오 계정으로 시작하기</div>
          </a>
          <a
            href={`${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/apple?nextPageUrl=${
              location.origin
            }/make`}
            className="mt-[1.5rem] flex h-[6.25rem] w-[35.625rem] items-center justify-center rounded-[1.25rem] border bg-[#231F20] shadow-banner"
          >
            <AppleIcon className="mr-[3.125rem] h-[2.125rem] w-[2.25rem]" />
            <div className="font-apple text-[2rem] text-white">Apple 계정으로 시작하기</div>
          </a>
        </div>
        <div className="flex font-apple text-[1rem] text-sub-3">
          버튼을 누르면
          <a
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            className="ml-[.5rem] underline underline-offset-[.1875rem]"
          >
            서비스 약관,
          </a>
          <a
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            className="ml-[.5rem] underline underline-offset-[.1875rem]"
          >
            개인정보 취급 방침
          </a>
          에 동의하신 것으로 간주합니다.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
