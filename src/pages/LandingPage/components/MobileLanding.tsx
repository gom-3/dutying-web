import {
  AppstoreGrayIcon,
  AppstoreIcon,
  Logo,
  LogoWithSymbol,
  PlaystoreGrayIcon,
  PlaystoreIcon,
} from '@assets/svg';
import Event from '@components/Event';
import useAuth from '@hooks/auth/useAuth';
import ROUTE from '@libs/constant/path';
import { events, sendEvent } from 'analytics';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface MobileLandingProps {
  open: boolean;
  onClose: () => void;
}

function MobileLanding({ open, onClose }: MobileLandingProps) {
  const {
    state: { isAuth, accountMe },
    actions: { handleLogout, demoTry },
  } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex w-screen flex-col">
      <Event open={open} onClose={onClose} />

      {/* 모바일 헤더 */}
      <div className="fixed top-0 z-10 h-[60px] w-full bg-white">
        <div className="mx-auto flex h-full w-[85%] items-center">
          <LogoWithSymbol className="w-[98.5504px] shrink-0" />
          <div className="flex w-full items-center">
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="ml-auto rounded-[1.875rem] bg-main-1 px-[10px] py-[5px] font-apple text-[12px] font-semibold text-white"
            >
              다운로드
            </a>
          </div>
        </div>
      </div>

      {/* 모바일 메인 */}
      <div className='h-real-screen min-h-[660px] w-screen bg-[url("/img/landing_mobile_1.webp")] bg-cover bg-center bg-no-repeat pb-[6.25rem] pt-[60px]'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[30px]">
          <h1 className="font-line text-[32px] font-bold leading-[42px] text-main-1">
            근무표,
            <br />
            이제 더 간편하게!
          </h1>

          <div className="mt-auto flex items-center gap-[8px]">
            <div className="flex h-[24px] items-center rounded-[5px] bg-main-4 px-[8px] font-poppins text-[16px] text-main-1">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-white">
              근무 일정 관리 (일반 간호사 용)
            </p>
          </div>

          <div className="mt-[15px] flex h-[38px] gap-[10px]">
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white font-apple text-[16px] font-semibold"
            >
              <PlaystoreIcon className="w-[17px]" />
              Google Play
            </a>
            <a
              href="https://abr.ge/bv13wa"
              target="_blank"
              className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-white font-apple text-[16px] font-semibold"
            >
              <AppstoreIcon className="w-[17px]" />
              App Store
            </a>
          </div>
        </div>
      </div>

      {/* 모바일 앱 기능 소개 섹션들 */}
      <div className='h-real-screen w-screen bg-[url("/img/landing_mobile_4.webp")] bg-cover bg-center bg-no-repeat'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[124px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-white px-[6px] font-poppins text-[14px] text-main-2">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1">홈</p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-white">
            근무관리부터
            <br />
            개인 일정까지 한번에
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-[#FDFCFEB2]">
            매월 근무 등록하고
            <br />
            개인 일정을 유형별로 관리해보세요.
          </p>
        </div>
      </div>

      <div className='h-real-screen w-screen bg-[url("/img/landing_mobile_5.webp")] bg-cover bg-center bg-no-repeat'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[124px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-main-4 px-[6px] font-poppins text-[14px] text-main-1">
              App
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1">소셜 (친구 · 모임)</p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-text-1">
            동료의 근무 일정을
            <br />
            한눈에
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-sub-2">
            동료와 친구를 맺어
            <br />
            일정을 편하게 조율해보세요.
          </p>
        </div>
      </div>

      {/* 웹 기능 소개 섹션들 */}
      <div className='h-real-screen w-screen bg-[url("/img/landing_mobile_2.webp")] bg-cover bg-center bg-no-repeat'>
        <div className="mx-auto mt-[124px] flex w-[85%] flex-col">
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-main-4 px-[6px] font-poppins text-[14px] text-main-1">
              Web
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1">근무표 만들기</p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-text-1">
            복잡한 근무표 작성을 <br /> 간편하게 자동으로!
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-sub-2">
            직접 편집한 제약 조건들에 딱 맞는
            <br />
            근무표를 작성해드릴게요.
          </p>
        </div>
      </div>

      <div className='h-real-screen w-screen bg-[url("/img/landing_mobile_3.webp")] bg-cover bg-center bg-no-repeat'>
        <div className="mx-auto flex h-full w-[85%] flex-col pt-[64px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[22px] items-center rounded-[5px] bg-white px-[6px] font-poppins text-[14px] text-main-1">
              Web
            </div>
            <p className="font-apple text-[14px] font-medium text-main-1">근무표 만들기</p>
          </div>

          <h1 className="mt-[34px] font-line text-[24px] font-bold leading-[38px] tracking-[0.36px] text-text-1">
            더 꼼꼼하게,
            <br />
            하지만 더 편리하게
          </h1>

          <p className="mt-[16px] font-apple text-[16px] font-medium leading-[24px] text-sub-2">
            근무표 작성을 돕기 위한
            <br />
            여러 보조 기능들이 마련되어 있습니다.
          </p>
        </div>
      </div>

      {/* 모바일 푸터 */}
      <div className="h-[770px] w-screen">
        <div className="mx-auto mt-[62px] flex w-[85%] flex-col">
          <div>
            <h1 className="font-apple text-[16px] font-semibold text-sub-2">듀팅 다운로드</h1>

            <div className="mt-[24px] font-apple text-[14px] font-medium text-sub-2.5">
              모바일 앱
            </div>
            <div className="mt-[15px] flex h-[38px] gap-[10px]">
              <a
                href="https://abr.ge/bv13wa"
                target="_blank"
                className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold"
              >
                <PlaystoreGrayIcon className="w-[17px]" />
                Google Play
              </a>
              <a
                href="https://abr.ge/bv13wa"
                target="_blank"
                className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold"
              >
                <AppstoreGrayIcon className="w-[19px]" />
                App Store
              </a>
            </div>

            <div className="mt-[32px] font-apple text-[14px] font-medium text-sub-2.5">웹</div>
            <div className="mt-[12px] flex h-[38px] gap-[10px]">
              {accountMe?.status === 'DEMO' ? (
                <div
                  className="flex flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold"
                  onClick={() => navigate(ROUTE.MAKE)}
                >
                  데모 테스트 마저 하기
                </div>
              ) : (
                <>
                  {!accountMe && (
                    <div
                      className="flex flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold"
                      onClick={() => {
                        demoTry();
                        sendEvent(events.landingPage.demoStart);
                      }}
                    >
                      근무표 작성 체험하기
                    </div>
                  )}
                  <div
                    className="flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-[16px] font-semibold"
                    onClick={() => {
                      navigate(ROUTE.MAKE);
                      sendEvent(events.landingPage.makeDuty);
                    }}
                  >
                    <Logo className="w-[17px]" />
                    근무표 만들기
                  </div>
                </>
              )}
            </div>

            <a
              href="http://ye620.channel.io"
              className="mt-[62px] block font-apple text-[16px] font-medium text-sub-2"
              onClick={() => {
                sendEvent(events.landingPage.footer.partnership);
              }}
            >
              제휴 문의
            </a>
          </div>
        </div>

        <div className="h-px w-full bg-sub-4.5" />
        <div className="mx-auto flex w-[85%] gap-[24px] pt-[24px]">
          <a
            className="block font-apple text-[14px] font-bold text-sub-2.5"
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            target="_blank"
            onClick={() => {
              sendEvent(events.landingPage.footer.terms);
            }}
          >
            이용 약관
          </a>
          <a
            className="block font-apple text-[14px] font-bold text-sub-2.5"
            href="https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4"
            target="_blank"
            onClick={() => {
              sendEvent(events.landingPage.footer.terms);
            }}
          >
            개인 정보 처리 방침
          </a>
        </div>
      </div>
    </div>
  );
}

export default MobileLanding;
