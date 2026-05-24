import {Carousel} from 'react-responsive-carousel';
import {useLocation, useNavigate} from 'react-router';
import {getIsDemoSignupLoginReason} from '@/features/auth/model/demo-session';
import {AppleIcon, BackCircle, FullLogo, KakaoIcon, LogoSymbolFill, NextCircle} from '@/shared/assets/svg';
import {buildAuthAuthorizeUrl, RUNTIME_CONFIG, sanitizeInternalPath} from '@/shared/config/runtime';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './index.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const {t} = useTypedTranslation();
    const {search} = useLocation();
    const params = new URLSearchParams(search);
    const nextPath = sanitizeInternalPath(params.get('next'), ROUTE.MAKE);
    const isDemoSignupFlow = getIsDemoSignupLoginReason(search);
    const title = isDemoSignupFlow ? t('page.login.demoExpired.title') : t('page.login.title');
    const description = isDemoSignupFlow ? t('page.login.demoExpired.description') : t('page.login.description');

    return (
        <div className="flex w-screen">
            <div className="hidden h-screen w-[calc(100vh/1080*1140)] min-w-0 shrink xl:block">
                <Carousel
                    autoPlay
                    infiniteLoop
                    dynamicHeight
                    stopOnHover
                    showArrows
                    interval={3000}
                    showIndicators={false}
                    showThumbs={false}
                    statusFormatter={(current, total) => `${current} / ${total}`}
                    renderArrowPrev={(click) => (
                        <BackCircle
                            className="absolute top-[50%] left-20 z-10 h-13 w-13 translate-y-[-50%] cursor-pointer"
                            onClick={click}
                        />
                    )}
                    renderArrowNext={(click) => (
                        <NextCircle
                            className="absolute top-[50%] right-20 z-10 h-13 w-13 translate-y-[-50%] cursor-pointer"
                            onClick={click}
                        />
                    )}
                >
                    <div className='h-screen w-full min-w-px bg-[url("/img/login_1.webp")] bg-cover bg-center'></div>
                    <div className='h-screen w-full min-w-px bg-[url("/img/login_2.webp")] bg-cover bg-center'></div>
                    <div className='h-screen w-full min-w-px bg-[url("/img/login_3.webp")] bg-cover bg-center'></div>
                </Carousel>
            </div>
            <div className="z-10 flex h-screen min-w-195 flex-1 shrink-0 flex-col items-center justify-between bg-white px-26.25 pt-35 pb-25">
                <div className="flex cursor-pointer" onClick={() => navigate(ROUTE.ROOT)}>
                    <LogoSymbolFill className="mr-[2.3438rem] h-12.5 w-[2.9688rem]" />
                    <FullLogo className="h-12.5 w-45.25" />
                </div>
                <div className="flex flex-col">
                    {isDemoSignupFlow ? (
                        <div className="mb-6 rounded-[1.25rem] border border-main-3/40 bg-main-light px-6 py-5">
                            <p className="font-apple text-sm font-semibold text-main-1">{t('page.login.demoExpired.bannerTitle')}</p>
                            <p className="mt-2 font-apple text-[0.9375rem] leading-6 text-sub-2.5">
                                {t('page.login.demoExpired.bannerDescription')}
                            </p>
                        </div>
                    ) : null}
                    <h1 className="font-apple text-[2rem] font-semibold text-text-1">{title}</h1>
                    <p className="mt-3 font-apple text-[1rem] leading-6 text-gray-3">{description}</p>
                    <a
                        href={buildAuthAuthorizeUrl('kakao', nextPath)}
                        className="mt-10.5 flex h-25 w-142.5 items-center justify-center rounded-[1.25rem] bg-[#FEE500] shadow-banner"
                    >
                        <KakaoIcon className="mr-12.5 h-8.5 w-9" />
                        <div className="font-apple text-[2rem] text-sub-1">{t('page.login.kakaoCta')}</div>
                    </a>
                    <a
                        href={buildAuthAuthorizeUrl('apple', nextPath)}
                        className="mt-6 flex h-25 w-142.5 items-center justify-center rounded-[1.25rem] bg-[#231F20] shadow-banner"
                    >
                        <AppleIcon className="mr-12.5 h-8.5 w-9" />
                        <div className="font-apple text-[2rem] text-white">{t('page.login.appleCta')}</div>
                    </a>
                </div>
                <div className="flex font-apple text-[1rem] text-sub-3">
                    {t('page.login.termsPrefix')}
                    <a href={RUNTIME_CONFIG.docs.termsOfService} className="ml-[.5rem] underline underline-offset-[.1875rem]">
                        {t('page.login.termsOfService')}
                    </a>
                    <a href={RUNTIME_CONFIG.docs.privacyPolicy} className="ml-[.5rem] underline underline-offset-[.1875rem]">
                        {t('page.login.privacyPolicy')}
                    </a>
                    {t('page.login.termsSuffix')}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
