import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';
import {AppstoreGrayIcon, AppstoreIcon, Logo, LogoWithSymbol, PlaystoreGrayIcon, PlaystoreIcon} from '@/assets/svg';
import useAuth from '@/hooks/auth/useAuth';
import ROUTE from '@/libs/constant/path';
import {events, sendEvent} from 'analytics';

function WebLanding() {
    const {
        state: {isAuth, accountMe},
        actions: {handleLogout, demoTry},
    } = useAuth();
    const navigate = useNavigate();
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

    return (
        <div className="flex w-screen flex-col">
            {/* 웹 헤더 */}
            <div className="fixed top-0 z-10 h-[4.5rem] w-full bg-white">
                <div className="container mx-auto flex size-full items-center">
                    <LogoWithSymbol className="w-[8.4375rem] shrink-0" />
                    <div className="flex w-full items-center">
                        <div className="mr-[3.75rem] ml-auto flex h-10 items-center gap-[2.8125rem] border-r-[.0625rem] border-sub-4 pr-[3.75rem]">
                            <p
                                className={`cursor-pointer font-apple text-[1.125rem] font-medium underline ${
                                    focus === 'web' ? 'text-main-1' : 'text-sub-2.5'
                                }`}
                                onClick={() => {
                                    webSection.current?.scrollIntoView({behavior: 'smooth'});
                                    sendEvent(events.landingPage.header.web);
                                }}
                            >
                                웹 주요 기능
                            </p>
                            <p
                                className={`cursor-pointer font-apple text-[1.125rem] font-medium underline ${
                                    focus === 'mobile' ? 'text-main-1' : 'text-sub-2.5'
                                }`}
                                onClick={() => {
                                    mobileSection.current?.scrollIntoView({behavior: 'smooth'});
                                    sendEvent(events.landingPage.header.mobile);
                                }}
                            >
                                모바일 앱 주요 기능
                            </p>
                        </div>
                        <div className="flex h-10 items-center gap-[2.8125rem]">
                            <a
                                href="https://abr.ge/bv13wa"
                                target="_blank"
                                className="cursor-pointer font-apple text-[1.125rem] font-medium text-sub-2.5 underline"
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
                                className="font-apple text-[1.125rem] font-medium text-sub-2.5"
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
                                    className="cursor-pointer rounded-[1.875rem] border-[.0625rem] border-sub-2.5 px-4 py-[.25rem] font-apple text-[1.125rem] font-medium text-sub-2.5"
                                >
                                    {accountMe?.status === 'DEMO' ? '데모 종료하기' : '로그아웃'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate(ROUTE.LOGIN)}
                                    className="cursor-pointer rounded-[1.875rem] border-[.0625rem] border-sub-2.5 bg-main-1 px-4 py-[.25rem] font-apple text-[1.125rem] font-medium text-white"
                                >
                                    로그인
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 웹 메인 */}
            <div className='relative h-real-screen min-h-[660px] w-screen bg-[url("/img/landing_1.webp")] bg-cover bg-center bg-no-repeat py-0'>
                <div className="relative top-1/2 container mx-auto h-fit -translate-y-1/2">
                    <h1 className="font-line text-[4rem] leading-[5.4375rem] font-bold text-white">
                        근무표,
                        <br />
                        이제 더 간편하게!
                    </h1>

                    <div className="mt-[2.1875rem] flex items-center gap-[8px]">
                        <div className="flex h-[1.875rem] w-[3.875rem] items-center justify-center rounded-[5px] bg-main-4 px-[.5rem] font-poppins text-[1.25rem] text-main-1">
                            App
                        </div>
                        <p className="font-apple text-[14px] font-medium text-white">
                            일정 관리의 모든 여정이 더 편리해지는 경험을 제공합니다.
                        </p>
                    </div>

                    <div className="mt-[.5625rem] flex items-center gap-[8px]">
                        <div className="flex h-[1.875rem] w-[3.875rem] items-center justify-center rounded-[5px] bg-main-4 px-[.5rem] font-poppins text-[1.25rem] text-main-1">
                            Web
                        </div>
                        <p className="font-apple text-[14px] font-medium text-white">
                            근무표를 더 쉽고 빠르게 작성할 수 있도록 도와드립니다.
                        </p>
                    </div>

                    <div className="mt-[5.1875rem] flex items-center gap-[8px]">
                        <div className="flex h-[1.875rem] w-[3.875rem] items-center justify-center rounded-[5px] bg-main-4 px-[.5rem] font-poppins text-[1.25rem] text-main-1">
                            App
                        </div>
                        <p className="font-apple text-[14px] font-medium text-sub-2">근무 일정 관리 (일반 간호사 용)</p>
                    </div>

                    <div className="mt-[.75rem] flex h-[3.75rem] gap-[3.125rem]">
                        <a
                            href="https://abr.ge/bv13wa"
                            target="_blank"
                            className="flex w-[15.3125rem] cursor-pointer items-center justify-center gap-[9px] rounded-[.9375rem] bg-white font-apple text-[1.5rem] font-semibold shadow-shadow-3"
                            rel="noreferrer"
                        >
                            <PlaystoreIcon className="w-7" />
                            Google Play
                        </a>
                        <a
                            href="https://abr.ge/bv13wa"
                            target="_blank"
                            className="flex w-[15.3125rem] cursor-pointer items-center justify-center gap-[9px] rounded-[.9375rem] bg-white font-apple text-[1.5rem] font-semibold shadow-shadow-3"
                            rel="noreferrer"
                        >
                            <AppstoreIcon className="w-[1.9375rem]" />
                            App Store
                        </a>
                    </div>

                    <div className="mt-[2.8125rem] flex items-center gap-[8px]">
                        <div className="flex h-[1.875rem] w-[3.875rem] items-center justify-center rounded-[5px] bg-main-4 px-[.5rem] font-poppins text-[1.25rem] text-main-1">
                            Web
                        </div>
                        <p className="font-apple text-[14px] font-medium text-sub-2">근무표 작성 (수간호사 용)</p>
                    </div>

                    <div className="mt-[.75rem] mb-20 flex h-[3.75rem] shrink-0 gap-[3.125rem]">
                        {accountMe?.status === 'DEMO' ? (
                            <div
                                className="flex w-[15.3125rem] cursor-pointer items-center justify-center rounded-[.9375rem] bg-white font-apple text-[1.5rem] font-semibold shadow-shadow-3"
                                onClick={() => navigate(ROUTE.MAKE)}
                            >
                                데모 테스트 마저 하기
                            </div>
                        ) : (
                            <>
                                {!accountMe && (
                                    <div
                                        className="flex w-[15.3125rem] cursor-pointer items-center justify-center rounded-[.9375rem] bg-white font-apple text-[1.5rem] font-semibold shadow-shadow-3"
                                        onClick={() => {
                                            demoTry();
                                            sendEvent(events.landingPage.demoStart);
                                        }}
                                    >
                                        근무표 작성 체험하기
                                    </div>
                                )}
                                <div
                                    className="flex w-[15.3125rem] cursor-pointer items-center justify-center gap-[9px] rounded-[.9375rem] bg-white font-apple text-[1.5rem] font-semibold shadow-shadow-3"
                                    onClick={() => {
                                        navigate(ROUTE.MAKE);
                                        sendEvent(events.landingPage.makeDuty);
                                    }}
                                >
                                    <Logo className="w-[1.6875rem]" />
                                    근무표 만들기
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 모바일 앱 기능 소개 섹션 */}
            <div
                id="mobile"
                ref={mobileSection}
                className='h-real-screen w-screen bg-[url("/img/landing_4.webp")] bg-cover bg-center bg-no-repeat'
            >
                <div className="container mx-auto mt-[8.875rem] flex items-start">
                    <div className="w-[28.125rem]">
                        <div className="flex items-center gap-[8px]">
                            <div className="flex h-[1.875rem] items-center rounded-[5px] bg-white px-[.5rem] font-poppins text-[1.25rem] text-main-2">
                                App
                            </div>
                            <p className="font-apple text-[1.5rem] font-medium text-main-1">홈</p>
                        </div>

                        <h1 className="mt-[.75rem] font-line text-[3.25rem] leading-[142%] font-bold text-white">
                            근무관리부터
                            <br />
                            개인 일정까지 한번에
                        </h1>

                        <p className="mt-[2.625rem] font-apple text-[1.75rem] leading-normal font-medium text-[#FDFCFEB2]">
                            매월 근무 등록하고
                            <br />
                            개인 일정을 유형별로 관리해보세요.
                        </p>
                    </div>
                </div>
            </div>

            <div className='h-real-screen w-screen bg-[url("/img/landing_5.webp")] bg-cover bg-center bg-no-repeat'>
                <div className="container mx-auto mt-[8.875rem] flex justify-end">
                    <div className="w-[28.125rem]">
                        <div className="flex items-center gap-[8px]">
                            <div className="flex h-[1.875rem] items-center rounded-[5px] bg-main-4 px-[.5rem] font-poppins text-[1.25rem] text-main-1">
                                App
                            </div>
                            <p className="font-apple text-[1.5rem] font-medium text-main-1">소셜 (친구 · 모임)</p>
                        </div>

                        <h1 className="mt-[.75rem] font-line text-[3.25rem] leading-[142%] font-bold text-text-1">
                            동료의 근무 일정을
                            <br />
                            한눈에
                        </h1>

                        <p className="mt-[2.625rem] font-apple text-[1.75rem] leading-normal font-medium text-sub-2">
                            동료와 친구를 맺어
                            <br />
                            일정을 편하게 조율해보세요.
                        </p>
                    </div>
                </div>
            </div>

            {/* 웹 기능 소개 섹션 */}
            <div
                id="web"
                ref={webSection}
                className='h-real-screen w-screen bg-[url("/img/landing_2.webp")] bg-cover bg-center bg-no-repeat'
            >
                <div className="container mx-auto mt-[8.875rem] flex justify-end">
                    <div className="w-[28.125rem]">
                        <div className="flex items-center gap-[8px]">
                            <div className="flex h-[1.875rem] items-center rounded-[5px] bg-main-4 px-[.5rem] font-poppins text-[1.25rem] text-main-1">
                                Web
                            </div>
                            <p className="font-apple text-[1.5rem] font-medium text-main-1">근무표 만들기</p>
                        </div>

                        <h1 className="mt-[.75rem] font-line text-[3.25rem] leading-[142%] font-bold text-text-1">
                            복잡한 근무표 작성을 <br /> 간편하게 자동으로!
                        </h1>

                        <p className="mt-[2.625rem] font-apple text-[1.75rem] leading-normal font-medium text-sub-2">
                            직접 편집한 제약 조건들에 딱 맞는
                            <br />
                            근무표를 작성해드릴게요.
                        </p>
                    </div>
                </div>
            </div>

            <div className='h-real-screen w-screen bg-[url("/img/landing_3.webp")] bg-cover bg-center bg-no-repeat'>
                <div className="container mx-auto mt-[8.875rem] flex items-start">
                    <div className="w-[28.125rem]">
                        <div className="flex items-center gap-[8px]">
                            <div className="flex h-[1.875rem] items-center rounded-[5px] bg-white px-[.5rem] font-poppins text-[1.25rem] text-main-1">
                                Web
                            </div>
                            <p className="font-apple text-[1.5rem] font-medium text-main-1">근무표 만들기</p>
                        </div>

                        <h1 className="mt-[.75rem] font-line text-[3.25rem] leading-[142%] font-bold text-text-1">
                            더 꼼꼼하게,
                            <br />
                            하지만 더 편리하게
                        </h1>

                        <p className="mt-[2.625rem] font-apple text-[1.75rem] leading-normal font-medium text-sub-2">
                            근무표 작성을 돕기 위한
                            <br />
                            여러 보조 기능들이 마련되어 있습니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 웹 푸터 */}
            <div className="h-[31.25rem] w-screen">
                <div className="container mx-auto mt-[6.875rem] flex flex-row-reverse items-stretch px-[11.25rem]">
                    <div className="flex-1">
                        <h1 className="mt-0 font-apple text-[1.25rem] font-semibold text-sub-2">듀팅 다운로드</h1>

                        <div className="mt-6 flex w-full items-center gap-4">
                            <div className="w-24 font-apple text-[14px] font-medium text-sub-2.5">모바일 앱</div>
                            <div className="flex h-[38px] gap-[10px]">
                                <a
                                    href="https://abr.ge/bv13wa"
                                    target="_blank"
                                    className="flex w-[10.625rem] cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-base font-semibold"
                                    rel="noreferrer"
                                >
                                    <PlaystoreGrayIcon className="w-[17px]" />
                                    Google Play
                                </a>
                                <a
                                    href="https://abr.ge/bv13wa"
                                    target="_blank"
                                    className="flex w-[10.625rem] cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-base font-semibold"
                                    rel="noreferrer"
                                >
                                    <AppstoreGrayIcon className="w-[19px]" />
                                    App Store
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 flex w-full items-center gap-4">
                            <div className="w-24 font-apple text-[14px] font-medium text-sub-2.5">웹</div>
                            <div className="flex h-[38px] gap-[10px]">
                                {accountMe?.status === 'DEMO' ? (
                                    <div
                                        className="flex w-[10.625rem] cursor-pointer items-center justify-center rounded-[8px] bg-sub-5 font-apple text-base font-semibold"
                                        onClick={() => navigate(ROUTE.MAKE)}
                                    >
                                        데모 테스트 마저 하기
                                    </div>
                                ) : (
                                    <>
                                        {!accountMe && (
                                            <div
                                                className="flex w-[10.625rem] cursor-pointer items-center justify-center rounded-[8px] bg-sub-5 font-apple text-base font-semibold"
                                                onClick={() => {
                                                    demoTry();
                                                    sendEvent(events.landingPage.demoStart);
                                                }}
                                            >
                                                근무표 작성 체험하기
                                            </div>
                                        )}
                                        <div
                                            className="flex w-[10.625rem] cursor-pointer items-center justify-center gap-[9px] rounded-[8px] bg-sub-5 font-apple text-base font-semibold"
                                            onClick={() => {
                                                navigate(ROUTE.MAKE);
                                                sendEvent(events.landingPage.makeDuty);
                                            }}
                                        >
                                            <Logo className="w-[1.6875rem]" />
                                            근무표 만들기
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <a
                            href="http://ye620.channel.io"
                            className="mt-0 block font-apple text-[1.25rem] font-medium text-sub-2"
                            onClick={() => {
                                sendEvent(events.landingPage.footer.partnership);
                            }}
                        >
                            제휴 문의
                        </a>
                    </div>
                </div>

                <div className="container mx-auto mt-11 h-px w-full bg-sub-4.5" />
                <div className="container mx-auto flex gap-[24px] px-[11.25rem] pt-[24px]">
                    <a
                        className="block font-apple text-base font-bold text-sub-2.5"
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
                        className="block font-apple text-base font-bold text-sub-2.5"
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

export default WebLanding;
