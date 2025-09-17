import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AppstoreGrayIcon,
  AppstoreIcon,
  Logo,
  LogoWithSymbol,
  PlaystoreGrayIcon,
  PlaystoreIcon,
} from '@/assets/svg';
import Event from '@/components/Event';
import useAuth from '@/hooks/auth/useAuth';
import ROUTE from '@/libs/constant/path';
import { events, sendEvent } from 'analytics';

function LandingPage() {
  const {
    state: { isAuth, accountMe },
    actions: { handleLogout, demoTry },
  } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState('top');
  const webSection = useRef<HTMLDivElement>(null);
  const mobileSection = useRef<HTMLDivElement>(null);
  const handleScroll = useCallback(() => {
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
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (new Date() < new Date('2023-11-22')) {
      setOpen(true);
    }
  }, []);

  return (
    <div className="flex w-screen flex-col">
      <Event open={open} onClose={() => setOpen(false)} />
      {/* 헤더 */}
      <div className="fixed top-0 z-10 h-[60px] w-full bg-white xl:h-18">
        <div className="mx-auto flex h-full w-[85%] items-center xl:container">
          <LogoWithSymbol className="w-[98.5504px] shrink-0 xl:w-33.75" />
          <div className="flex w-full items-center xl:hidden">
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="bg-main-1 font-apple ml-auto rounded-[1.875rem] px-[10px] py-[5px] text-[12px] font-semibold text-white"
              rel="noreferrer"
            >
              다운로드
            </a>
          </div>
          <div className="hidden w-full items-center xl:flex">
            <div className="border-sub-4 mr-15 ml-auto flex h-10 items-center gap-11.25 border-r-[.0625rem] pr-15">
              <p
                className={`font-apple cursor-pointer text-[1.125rem] font-medium underline ${
                  focus === 'web' ? 'text-main-1' : 'text-sub-2.5'
                }`}
                onClick={() => {
                  webSection.current?.scrollIntoView({ behavior: 'smooth' });
                  sendEvent(events.landingPage.header.web);
                }}
              >
                웹 주요 기능
              </p>
              <p
                className={`font-apple cursor-pointer text-[1.125rem] font-medium underline ${
                  focus === 'mobile' ? 'text-main-1' : 'text-sub-2.5'
                }`}
                onClick={() => {
                  mobileSection.current?.scrollIntoView({ behavior: 'smooth' });
                  sendEvent(events.landingPage.header.mobile);
                }}
              >
                모바일 앱 주요 기능
              </p>
            </div>
            <div className="flex h-10 items-center gap-11.25">
              <a
                href="https://abr.ge/bv13wa"
                target="_blank"
                className="font-apple text-sub-2.5 cursor-pointer text-[1.125rem] font-medium underline"
                onClick={() => {
                  sendEvent(events.landingPage.header.download);
                }}
                rel="noreferrer"
              >
                다운로드
              </a>
              <a
                href="http://ye620.channel.io"
                target="_blank"
                className="font-apple text-sub-2.5 text-[1.125rem] font-medium"
                onClick={() => {
                  sendEvent(events.landingPage.header.ask);
                }}
                rel="noreferrer"
              >
                문의하기
              </a>
              {isAuth ? (
                <button
                  onClick={() => handleLogout()}
                  className="border-sub-2.5 font-apple text-sub-2.5 cursor-pointer rounded-[1.875rem] border-[.0625rem] px-4 py-[.25rem] text-[1.125rem] font-medium"
                >
                  {accountMe?.status === 'DEMO' ? '데모 종료하기' : '로그아웃'}
                </button>
              ) : (
                <button
                  onClick={() => navigate(ROUTE.LOGIN)}
                  className="border-sub-2.5 bg-main-1 font-apple cursor-pointer rounded-[1.875rem] border-[.0625rem] px-4 py-[.25rem] text-[1.125rem] font-medium text-white"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*메인*/}
      <div className='h-real-screen min-h-[660px] w-screen bg-[url("/img/landing_mobile_1.webp")] bg-cover bg-center bg-no-repeat pt-[60px] pb-25 xl:relative xl:bg-[url("/img/landing_1.webp")] xl:py-0'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[42px] xl:relative xl:top-[50%] xl:container xl:h-fit xl:translate-y-[-50%] xl:pt-0">
          <h1 className="font-line text-main-1 text-[32px] leading-[42px] font-bold xl:text-[4rem] xl:leading-21.75 xl:text-white">
            근무표,
            <br />
            이제 더 간편하게!
          </h1>
          <div className="mt-8.75 hidden items-center gap-[8px] xl:flex">
            <div className="bg-main-4 font-poppins text-main-1 flex h-[24px] items-center rounded-[5px] px-[8px] text-[16px] xl:h-7.5 xl:w-15.5 xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-white">
              일정 관리의 모든 여정이 더 편리해지는 경험을 제공합니다.
            </p>
          </div>
          <div className="mt-[.5625rem] hidden items-center gap-[8px] xl:flex">
            <div className="bg-main-4 font-poppins text-main-1 flex h-[24px] items-center rounded-[5px] px-[8px] text-[16px] xl:h-7.5 xl:w-15.5 xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple text-[14px] font-medium text-white">
              근무표를 더 쉽고 빠르게 작성할 수 있도록 도와드립니다.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-[8px] xl:mt-20.75">
            <div className="bg-main-4 font-poppins text-main-1 flex h-[24px] items-center rounded-[5px] px-[8px] text-[16px] xl:h-7.5 xl:w-15.5 xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple xl:text-sub-2 text-[14px] font-medium text-white">
              근무 일정 관리 (일반 간호사 용)
            </p>
          </div>
          <div className="mt-[15px] flex h-[38px] gap-[10px] xl:mt-[.75rem] xl:gap-12.5">
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="font-apple xl:shadow-shadow-3 flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white text-[16px] font-semibold xl:h-15 xl:w-61.25 xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem]"
              rel="noreferrer"
            >
              <PlaystoreIcon className="w-[17px] xl:w-7" />
              Google Play
            </a>
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="font-apple xl:shadow-shadow-3 flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white text-[16px] font-semibold xl:h-15 xl:w-61.25 xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem]"
              rel="noreferrer"
            >
              <AppstoreIcon className="w-[17px] xl:w-7.75" />
              App Store
            </a>
          </div>
          <div className="mt-[43px] flex items-center gap-[8px] xl:mt-11.25">
            <div className="bg-main-4 font-poppins text-main-1 flex h-[24px] items-center rounded-[5px] px-[8px] text-[16px] xl:h-7.5 xl:w-15.5 xl:justify-center xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple xl:text-sub-2 text-[14px] font-medium text-white">
              근무표 작성 (수간호사 용)
            </p>
          </div>
          <div className="mt-[15px] flex h-[38px] shrink-0 gap-[10px] xl:mt-[.75rem] xl:mb-20 xl:gap-12.5">
            {accountMe?.status === 'DEMO' ? (
              <div
                className="font-apple xl:shadow-shadow-3 flex flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-white text-[16px] font-semibold xl:h-15 xl:w-61.25 xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem]"
                onClick={() => navigate(ROUTE.MAKE)}
              >
                데모 테스트 마저 하기
              </div>
            ) : (
              <>
                {!accountMe && (
                  <div
                    className="font-apple xl:shadow-shadow-3 flex flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-white text-[16px] font-semibold xl:h-15 xl:w-61.25 xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem]"
                    onClick={() => {
                      demoTry();
                      sendEvent(events.landingPage.demoStart);
                    }}
                  >
                    근무표 작성 체험하기
                  </div>
                )}
                <div
                  className="font-apple xl:shadow-shadow-3 flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white text-[16px] font-semibold xl:h-15 xl:w-61.25 xl:flex-none xl:rounded-[.9375rem] xl:text-[1.5rem]"
                  onClick={() => {
                    navigate(ROUTE.MAKE);
                    sendEvent(events.landingPage.makeDuty);
                  }}
                >
                  <Logo className="w-[17px] xl:w-6.75" />
                  근무표 만들기
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/*메인 4*/}
      <div
        id="mobile"
        ref={mobileSection}
        className='h-real-screen w-screen bg-[url("/img/landing_mobile_4.webp")] bg-cover bg-center bg-no-repeat xl:bg-[url("/img/landing_4.webp")]'
      >
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[124px] xl:container xl:mx-auto xl:mt-35.5 xl:items-start">
          <div className="flex items-center gap-[8px] xl:w-112.5">
            <div className="font-poppins text-main-2 flex h-[22px] items-center rounded-[5px] bg-white px-[6px] text-[14px] xl:h-7.5 xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple text-main-1 text-[14px] font-medium xl:text-[1.5rem]">홈</p>
          </div>

          <h1 className="font-line mt-[34px] text-[24px] leading-[38px] font-bold tracking-[0.36px] text-white xl:mt-[.75rem] xl:w-112.5 xl:text-[3.25rem] xl:leading-[142%]">
            근무관리부터
            <br />
            개인 일정까지 한번에
          </h1>

          <p className="font-apple mt-[16px] text-[16px] leading-[24px] font-medium text-[#FDFCFEB2] xl:mt-10.5 xl:w-112.5 xl:text-[1.75rem] xl:leading-normal">
            매월 근무 등록하고
            <br />
            개인 일정을 유형별로 관리해보세요.
          </p>
        </div>
      </div>

      {/*메인 5*/}
      <div className='h-real-screen w-screen bg-[url("/img/landing_mobile_5.webp")] bg-cover bg-center bg-no-repeat xl:bg-[url("/img/landing_5.webp")]'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[124px] xl:container xl:mx-auto xl:mt-35.5 xl:items-end">
          <div className="flex items-center gap-[8px] xl:w-112.5">
            <div className="bg-main-4 font-poppins text-main-1 flex h-[22px] items-center rounded-[5px] px-[6px] text-[14px] xl:h-7.5 xl:px-[.5rem] xl:text-[1.25rem]">
              App
            </div>
            <p className="font-apple text-main-1 text-[14px] font-medium xl:text-[1.5rem]">
              소셜 (친구 · 모임)
            </p>
          </div>

          <h1 className="font-line text-text-1 mt-[34px] text-[24px] leading-[38px] font-bold tracking-[0.36px] xl:mt-[.75rem] xl:w-112.5 xl:text-[3.25rem] xl:leading-[142%]">
            동료의 근무 일정을
            <br />
            한눈에
          </h1>

          <p className="font-apple text-sub-2 mt-[16px] text-[16px] leading-[24px] font-medium xl:mt-10.5 xl:w-112.5 xl:text-[1.75rem] xl:leading-normal">
            동료와 친구를 맺어
            <br />
            일정을 편하게 조율해보세요.
          </p>
        </div>
      </div>

      {/*메인 2*/}
      <div
        id="web"
        ref={webSection}
        className='h-real-screen w-screen bg-[url("/img/landing_mobile_2.webp")] bg-cover bg-center bg-no-repeat xl:bg-[url("/img/landing_2.webp")]'
      >
        <div className="mx-auto mt-[124px] flex w-[85%] flex-col xl:container xl:mx-auto xl:mt-35.5 xl:items-end">
          <div className="flex items-center gap-[8px] xl:w-112.5">
            <div className="bg-main-4 font-poppins text-main-1 flex h-[22px] items-center rounded-[5px] px-[6px] text-[14px] xl:h-7.5 xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple text-main-1 text-[14px] font-medium xl:text-[1.5rem]">
              근무표 만들기
            </p>
          </div>

          <h1 className="font-line text-text-1 mt-[34px] text-[24px] leading-[38px] font-bold tracking-[0.36px] xl:mt-[.75rem] xl:w-112.5 xl:text-[3.25rem] xl:leading-[142%]">
            복잡한 근무표 작성을 <br /> 간편하게 자동으로!
          </h1>

          <p className="font-apple text-sub-2 mt-[16px] text-[16px] leading-[24px] font-medium xl:mt-10.5 xl:w-112.5 xl:text-[1.75rem] xl:leading-normal">
            직접 편집한 제약 조건들에 딱 맞는
            <br />
            근무표를 작성해드릴게요.
          </p>
        </div>
      </div>

      {/*메인 3*/}
      <div className='h-real-screen w-screen bg-[url("/img/landing_mobile_3.webp")] bg-cover bg-center bg-no-repeat xl:bg-[url("/img/landing_3.webp")]'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[64px] xl:container xl:mx-auto xl:mt-35.5 xl:items-start">
          <div className="flex items-center gap-[8px] xl:w-112.5">
            <div className="font-poppins text-main-1 flex h-[22px] items-center rounded-[5px] bg-white px-[6px] text-[14px] xl:h-7.5 xl:px-[.5rem] xl:text-[1.25rem]">
              Web
            </div>
            <p className="font-apple text-main-1 text-[14px] font-medium xl:text-[1.5rem]">
              근무표 만들기
            </p>
          </div>

          <h1 className="font-line text-text-1 mt-[34px] text-[24px] leading-[38px] font-bold tracking-[0.36px] xl:mt-[.75rem] xl:w-112.5 xl:text-[3.25rem] xl:leading-[142%]">
            더 꼼꼼하게,
            <br />
            하지만 더 편리하게
          </h1>

          <p className="font-apple text-sub-2 mt-[16px] text-[16px] leading-[24px] font-medium xl:mt-10.5 xl:w-112.5 xl:text-[1.75rem] xl:leading-normal">
            근무표 작성을 돕기 위한
            <br />
            여러 보조 기능들이 마련되어 있습니다.
          </p>
        </div>
      </div>

      {/* 푸터 */}
      <div className="h-[770px] w-screen xl:h-125">
        <div className="mx-auto mt-[62px] flex w-[85%] flex-col xl:container xl:mx-auto xl:mt-27.5 xl:flex-row-reverse xl:items-stretch xl:px-45">
          <div className="xl:flex-1">
            <h1 className="font-apple text-sub-2 text-[16px] font-semibold xl:mt-0 xl:text-[1.25rem]">
              듀팅 다운로드
            </h1>
            <div className="xl:mt-6 xl:flex xl:w-full xl:items-center xl:gap-4">
              <div className="font-apple text-sub-2.5 mt-[24px] text-[14px] font-medium xl:mt-0 xl:w-24">
                모바일 앱
              </div>
              <div className="mt-[15px] flex h-[38px] gap-[10px] xl:mt-0">
                <a
                  href="https://abr.ge/bv13wa"
                  target="_blank"
                  className="bg-sub-5 font-apple flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] text-[16px] font-semibold xl:w-42.5 xl:text-base"
                  rel="noreferrer"
                >
                  <PlaystoreGrayIcon className="w-[17px]" />
                  Google Play
                </a>
                <a
                  href="https://abr.ge/bv13wa"
                  target="_blank"
                  className="bg-sub-5 font-apple flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] text-[16px] font-semibold xl:w-42.5 xl:text-base"
                  rel="noreferrer"
                >
                  <AppstoreGrayIcon className="w-[19px]" />
                  App Store
                </a>
              </div>
            </div>

            <div className="xl:mt-6 xl:flex xl:w-full xl:items-center xl:gap-4">
              <div className="font-apple text-sub-2.5 mt-[32px] text-[14px] font-medium xl:mt-0 xl:w-24">
                웹
              </div>
              <div className="mt-[12px] flex h-[38px] gap-[10px] xl:mt-0">
                {accountMe?.status === 'DEMO' ? (
                  <div
                    className="bg-sub-5 font-apple flex flex-1 cursor-pointer items-center justify-center rounded-[8px] text-[16px] font-semibold xl:w-42.5 xl:text-base"
                    onClick={() => navigate(ROUTE.MAKE)}
                  >
                    데모 테스트 마저 하기
                  </div>
                ) : (
                  <>
                    {!accountMe && (
                      <div
                        className="bg-sub-5 font-apple flex flex-1 cursor-pointer items-center justify-center rounded-[8px] text-[16px] font-semibold xl:w-42.5 xl:text-base"
                        onClick={() => {
                          demoTry();
                          sendEvent(events.landingPage.demoStart);
                        }}
                      >
                        근무표 작성 체험하기
                      </div>
                    )}
                    <div
                      className="bg-sub-5 font-apple flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] text-[16px] font-semibold xl:w-42.5 xl:text-base"
                      onClick={() => {
                        navigate(ROUTE.MAKE);
                        sendEvent(events.landingPage.makeDuty);
                      }}
                    >
                      <Logo className="w-[17px] xl:w-6.75" />
                      근무표 만들기
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="xl:flex-1">
            <a
              href="http://ye620.channel.io"
              className="font-apple text-sub-2 mt-[62px] block text-[16px] font-medium xl:mt-0 xl:text-[1.25rem]"
              onClick={() => {
                sendEvent(events.landingPage.footer.partnership);
              }}
            >
              제휴 문의
            </a>
          </div>
        </div>
        <div className="bg-sub-4.5 h-px w-full xl:container xl:mx-auto xl:mt-11" />
        <div className="mx-auto flex w-[85%] gap-[24px] pt-[24px] xl:container xl:mx-auto xl:px-45">
          <a
            className="font-apple text-sub-2.5 block text-[14px] font-bold xl:text-base"
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            target="_blank"
            onClick={() => {
              sendEvent(events.landingPage.footer.terms);
            }}
            rel="noreferrer"
          >
            이용 약관
          </a>
          <a
            className="font-apple text-sub-2.5 block text-[14px] font-bold xl:text-base"
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            target="_blank"
            onClick={() => {
              sendEvent(events.landingPage.footer.terms);
            }}
            rel="noreferrer"
          >
            개인 정보 처리 방침
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
