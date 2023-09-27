import {
  AppstoreGrayIcon,
  AppstoreIcon,
  Logo,
  LogoGray,
  LogoWithSymbol,
  MenuIcon,
  PlaystoreGrayIcon,
  PlaystoreIcon,
} from '@assets/svg';
import Button from '@components/Button';
import useAuth from '@hooks/auth/useAuth';
import ROUTE from '@libs/constant/path';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

function LandingPage() {
  const {
    state: { isAuth },
  } = useAuth();
  const navigate = useNavigate();

  const [focus, setFocus] = useState('top');

  const webSection = useRef<HTMLDivElement>(null);
  const mobileSection = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const webSectionTop = webSection.current?.getBoundingClientRect().top;
    const mobileSectionTop = mobileSection.current?.getBoundingClientRect().top;

    if (webSectionTop && mobileSectionTop) {
      if (mobileSectionTop < 100) {
        setFocus('mobile');
      } else if (webSectionTop < 100) {
        setFocus('web');
      } else {
        setFocus('top');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex w-screen flex-col">
      {/* 헤더 */}
      <div className="fixed top-0 z-10 h-[60px] w-full bg-white xl:h-[4.5rem]">
        <div className="mx-auto flex h-full w-[85%] items-center xl:container">
          <LogoWithSymbol className="w-[98.5504px] shrink-0 xl:w-[8.4375rem]" />
          <div className="flex w-full items-center xl:hidden">
            <Button className="ml-auto px-[10px] py-[5px] text-[12px] font-semibold">
              다운로드
            </Button>
            <MenuIcon className="ml-[20px] h-[24px] w-[24px]" />
          </div>
          <div className="hidden w-full items-center xl:flex">
            <div className="ml-auto mr-[3.75rem] flex h-[2.5rem] items-center gap-[2.8125rem] border-r-[.0625rem] border-sub-4 pr-[3.75rem]">
              <p
                className={`cursor-pointer font-apple text-[1.125rem] font-medium underline ${
                  focus === 'web' ? 'text-main-1' : 'text-sub-2.5'
                }`}
                onClick={() => webSection.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                웹 주요 기능
              </p>
              <p
                className={`cursor-pointer font-apple text-[1.125rem] font-medium underline ${
                  focus === 'mobile' ? 'text-main-1' : 'text-sub-2.5'
                }`}
                onClick={() => mobileSection.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                모바일 앱 주요 기능
              </p>
            </div>
            <div className="flex h-[2.5rem] items-center gap-[2.8125rem]">
              <a
                href="https://abr.ge/bv13wa"
                target="_blank"
                className="cursor-pointer font-apple text-[1.125rem] font-medium text-sub-2.5 underline"
              >
                다운로드
              </a>
              <a
                href="http://ye620.channel.io"
                target="_blank"
                className="font-apple text-[1.125rem] font-medium text-sub-2.5"
              >
                문의하기
              </a>
              {isAuth ? (
                <button className="cursor-pointer rounded-[1.875rem] border-[.0625rem] border-sub-2.5 px-[1rem] py-[.25rem] font-apple text-[1.125rem] font-medium text-sub-2.5">
                  로그아웃
                </button>
              ) : (
                <button
                  onClick={() => navigate(ROUTE.LOGIN)}
                  className="cursor-pointer rounded-[1.875rem] border-[.0625rem] border-sub-2.5 bg-main-1 px-[1rem] py-[.25rem] font-apple text-[1.125rem] font-medium text-white"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*메인*/}
      <div className='h-screen w-screen bg-[url("/img/landing_mobile_1.png")] bg-cover bg-center bg-no-repeat pt-[60px] xl:relative  xl:h-screen xl:bg-[url("/img/landing_1.png")] xl:pt-0'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[42px] xl:container xl:relative xl:top-[50%] xl:h-fit xl:translate-y-[-50%] xl:pt-0">
          <h1 className="font-line text-[32px] font-bold leading-[42px] text-main-1 xl:text-[4rem] xl:leading-[5.4375rem] xl:text-white">
            근무표,
            <br />
            이제 더 간편하게!
          </h1>
          <div className="mt-[2.1875rem] hidden items-center gap-[8px] xl:flex">
            <div className="flex h-[24px] items-center rounded-[5px] bg-main-4 px-[8px] font-poppins text-[16px] text-main-1 xl:h-[1.875rem] xl:w-[3.875rem] xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple text-[14px] font-medium text-white">
              근무표를 더 쉽고 빠르게 작성할 수 있도록 도와드립니다.
            </p>
          </div>
          <div className="mt-[.5625rem] hidden items-center gap-[8px] xl:flex">
            <div className="flex h-[24px] items-center rounded-[5px] bg-main-4 px-[8px] font-poppins text-[16px] text-main-1 xl:h-[1.875rem] xl:w-[3.875rem] xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-white">
              일정 관리의 모든 여정이 더 편리해지는 경험을 제공합니다.
            </p>
          </div>
          <div className="mt-[43vh] flex items-center gap-[8px] xl:mt-[5.1875rem]">
            <div className="flex h-[24px] items-center rounded-[5px] bg-main-4 px-[8px] font-poppins text-[16px] text-main-1 xl:h-[1.875rem] xl:w-[3.875rem] xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple text-[14px] font-medium text-white xl:text-sub-2">
              근무표 작성 (수간호사 용)
            </p>
          </div>
          <div className="mt-[15px] flex h-[38px] gap-[10px] xl:mt-[.75rem] xl:gap-[3.125rem]">
            <div className="flex flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-white font-apple text-[16px] font-semibold xl:h-[3.75rem] xl:w-[15.3125rem] xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem] xl:shadow-shadow-3">
              데모 테스트 해보기
            </div>
            <div
              className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white font-apple text-[16px] font-semibold xl:h-[3.75rem] xl:w-[15.3125rem] xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem] xl:shadow-shadow-3"
              onClick={() => navigate(ROUTE.MAKE)}
            >
              <Logo className="w-[17px] xl:w-[1.6875rem]" />
              근무표 만들기
            </div>
          </div>
          <div className="mt-[43px] flex items-center gap-[8px] xl:mt-[2.5rem]">
            <div className="flex h-[24px] items-center rounded-[5px] bg-main-4 px-[8px] font-poppins text-[16px] text-main-1 xl:h-[1.875rem] xl:w-[3.875rem] xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-white xl:text-sub-2">
              근무 일정 관리 (일반 간호사 용)
            </p>
          </div>
          <div className="mt-[15px] flex h-[38px] gap-[10px] xl:mb-[5rem] xl:mt-[.75rem] xl:gap-[3.125rem]">
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white font-apple text-[16px] font-semibold xl:h-[3.75rem] xl:w-[15.3125rem] xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem] xl:shadow-shadow-3"
            >
              <PlaystoreIcon className="w-[17px] xl:w-[1.75rem]" />
              Google Play
            </a>
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white font-apple text-[16px] font-semibold xl:h-[3.75rem] xl:w-[15.3125rem] xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem] xl:shadow-shadow-3"
            >
              <AppstoreIcon className="w-[17px] xl:w-[1.9375rem]" />
              App Store
            </a>
          </div>
        </div>
      </div>

      {/*메인 2*/}
      <div
        id="web"
        ref={webSection}
        className='h-screen w-screen bg-[url("/img/landing_mobile_2.png")] bg-cover bg-center bg-no-repeat xl:h-screen  xl:bg-[url("/img/landing_2.png")]'
      >
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[124px] xl:container xl:mx-auto xl:mt-[8.875rem] xl:items-end">
          <div className="flex items-center gap-[8px] xl:w-[28.125rem]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-main-4 px-[6px] font-poppins text-[14px] text-main-1 xl:h-[1.875rem] xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1 xl:text-[1.5rem]">
              근무표 만들기
            </p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-text-1 xl:mt-[.75rem] xl:w-[28.125rem] xl:text-[3.25rem] xl:leading-[142%]">
            복잡한 근무표 작성을 <br /> 간편하게 자동으로!
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-sub-2 xl:mt-[2.625rem] xl:w-[28.125rem] xl:text-[1.75rem] xl:leading-normal">
            직접 편집한 제약 조건들에 딱 맞는
            <br />
            근무표를 작성해드릴게요.
          </p>
        </div>
      </div>

      {/*메인 3*/}
      <div className='h-screen w-screen bg-[url("/img/landing_mobile_3.png")] bg-cover bg-center bg-no-repeat xl:h-screen  xl:bg-[url("/img/landing_3.png")]'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[64px] xl:container xl:mx-auto xl:mt-[8.875rem] xl:items-start">
          <div className="flex items-center gap-[8px] xl:w-[28.125rem]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-white px-[6px] font-poppins text-[14px] text-main-1 xl:h-[1.875rem] xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1 xl:text-[1.5rem]">
              근무표 만들기
            </p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-text-1 xl:mt-[.75rem] xl:w-[28.125rem] xl:text-[3.25rem] xl:leading-[142%]">
            더 꼼꼼하게,
            <br />
            하지만 더 편리하게
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-sub-2 xl:mt-[2.625rem] xl:w-[28.125rem] xl:text-[1.75rem] xl:leading-normal">
            근무표 작성을 돕기 위한
            <br />
            여러 보조 기능들이 마련되어 있습니다.
          </p>
        </div>
      </div>

      {/*메인 4*/}
      <div
        id="mobile"
        ref={mobileSection}
        className='h-screen w-screen bg-[url("/img/landing_mobile_4.png")] bg-cover bg-center bg-no-repeat xl:h-screen  xl:bg-[url("/img/landing_4.png")]'
      >
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[124px] xl:container xl:mx-auto xl:mt-[8.875rem] xl:items-start">
          <div className="flex items-center gap-[8px] xl:w-[28.125rem]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-white px-[6px] font-poppins text-[14px] text-main-2 xl:h-[1.875rem] xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1 xl:text-[1.5rem]">홈</p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-white xl:mt-[.75rem] xl:w-[28.125rem]  xl:text-[3.25rem] xl:leading-[142%]">
            근무관리부터
            <br />
            개인 일정까지 한번에
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-[#FDFCFEB2] xl:mt-[2.625rem] xl:w-[28.125rem] xl:text-[1.75rem] xl:leading-normal">
            매월 근무 등록하고
            <br />
            개인 일정을 유형별로 관리해보세요.
          </p>
        </div>
      </div>

      {/*메인 5*/}
      <div className='h-screen w-screen bg-[url("/img/landing_mobile_5.png")] bg-cover bg-center bg-no-repeat xl:h-screen  xl:bg-[url("/img/landing_5.png")]'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[124px] xl:container xl:mx-auto xl:mt-[8.875rem] xl:items-end">
          <div className="flex items-center gap-[8px] xl:w-[28.125rem]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-main-4 px-[6px] font-poppins text-[14px] text-main-1 xl:h-[1.875rem] xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1 xl:text-[1.5rem]">
              소셜 (친구 · 모임)
            </p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-text-1 xl:mt-[.75rem] xl:w-[28.125rem] xl:text-[3.25rem] xl:leading-[142%]">
            동료의 근무 일정을
            <br />
            한눈에
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-sub-2 xl:mt-[2.625rem] xl:w-[28.125rem] xl:text-[1.75rem] xl:leading-normal">
            동료와 친구를 맺어
            <br />
            일정을 편하게 조율해보세요.
          </p>
        </div>
      </div>

      {/* 푸터 */}
      <div className="h-[770px] w-screen xl:h-[31.25rem]">
        <div className="mx-auto mt-[62px] flex w-[85%] flex-col xl:container xl:mx-auto xl:mt-[6.875rem] xl:flex-row-reverse xl:items-stretch xl:px-[11.25rem]">
          <div className="xl:flex-1">
            <h1 className="font-apple text-[16px] font-semibold text-sub-2 xl:mt-0 xl:text-[1.25rem]">
              듀팅 다운로드
            </h1>
            <div className="xl:mt-[1.5rem] xl:flex xl:w-full xl:items-center xl:gap-[1rem]">
              <div className="mt-[32px] font-apple text-[14px] font-medium text-sub-2.5 xl:mt-0 xl:w-[6rem]">
                웹
              </div>
              <div className="mt-[12px] flex h-[38px] gap-[10px] xl:mt-0">
                <div className="flex flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold xl:w-[10.625rem] xl:text-base">
                  데모 테스트 해보기
                </div>
                <div className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold xl:w-[10.625rem] xl:text-base">
                  <LogoGray className="w-[16px]" />
                  근무표 만들기
                </div>
              </div>
            </div>

            <div className="xl:mt-[1.5rem] xl:flex xl:w-full xl:items-center xl:gap-[1rem]">
              <div className="mt-[24px] font-apple text-[14px] font-medium text-sub-2.5 xl:mt-0 xl:w-[6rem]">
                모바일 앱
              </div>
              <div className="mt-[15px] flex h-[38px] gap-[10px] xl:mt-0">
                <a
                  href="https://abr.ge/bv13wa"
                  target="_blank"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold xl:w-[10.625rem] xl:text-base"
                >
                  <PlaystoreGrayIcon className="w-[17px]" />
                  Google Play
                </a>
                <a
                  href="https://abr.ge/bv13wa"
                  target="_blank"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold xl:w-[10.625rem] xl:text-base"
                >
                  <AppstoreGrayIcon className="w-[19px]" />
                  App Store
                </a>
              </div>
            </div>
          </div>

          <div className="xl:flex-1">
            <a className="mt-[62px] block font-apple text-[16px] font-medium text-sub-2 xl:mt-0 xl:text-[1.25rem]">
              자주 묻는 질문
            </a>
            <a className="mb-[72px] mt-[24px] block font-apple text-[16px] font-medium text-sub-2 xl:mt-[1.5rem] xl:text-[1.25rem]">
              제휴 문의
            </a>
          </div>
        </div>
        <div className="h-[1px] w-full bg-sub-4.5 xl:container xl:mx-auto xl:mt-[2.75rem]" />
        <div className="mx-auto flex w-[85%] gap-[24px] pt-[24px] xl:container xl:mx-auto xl:px-[11.25rem]">
          <a
            className="block font-apple text-[14px] font-bold text-sub-2.5 xl:text-base"
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            target="_blank"
          >
            이용 약관
          </a>
          <a
            className="block font-apple text-[14px] font-bold text-sub-2.5 xl:text-base"
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            target="_blank"
          >
            개인 정보 처리 방침
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
