import {cn} from '@dutying/utils/style';
import {Clock3, TriangleAlert} from 'lucide-react';
import type {TDemoSessionInfo} from '@/features/auth/model/demo-session';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import StatusBadge from '@/shared/ui/StatusBadge';

type TDemoSessionBannerProps = {
    sessionInfo: TDemoSessionInfo | null;
};

const DemoSessionBanner = ({sessionInfo}: TDemoSessionBannerProps) => {
    const {t} = useTypedTranslation();
    const isExpiringSoon = sessionInfo?.isExpiringSoon ?? false;

    return (
        <section
            className={cn(
                'border-b px-5 py-4 md:px-8',
                isExpiringSoon ? 'border-[#FFD3D3] bg-[#FFF6F6]' : 'border-[#FFE0A3] bg-[linear-gradient(90deg,#FFF9EA_0%,#FFF3D6_100%)]',
            )}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge label={t('feature.auth.demoSession.badge')} tone="warning" size="md" />
                        <StatusBadge
                            label={t(isExpiringSoon ? 'feature.auth.demoSession.expiringSoon' : 'feature.auth.demoSession.signupRequired')}
                            tone={isExpiringSoon ? 'danger' : 'brand'}
                            size="sm"
                        />
                    </div>
                    <p className="mt-3 font-apple text-[1.375rem] leading-[1.35] font-semibold tracking-[-0.02em] text-sub-1">
                        {t(isExpiringSoon ? 'feature.auth.demoSession.titleExpiringSoon' : 'feature.auth.demoSession.title')}
                    </p>
                    <p className="mt-2 max-w-[780px] font-apple text-[0.9375rem] leading-6 text-sub-2.5">
                        {t(isExpiringSoon ? 'feature.auth.demoSession.descriptionExpiringSoon' : 'feature.auth.demoSession.description')}
                    </p>
                </div>

                <div
                    className={cn(
                        'flex min-w-[220px] shrink-0 items-center gap-3 self-start rounded-[20px] border bg-white/90 px-5 py-4 shadow-banner',
                        isExpiringSoon ? 'border-[#FFD3D3]' : 'border-[#F3D28C]',
                    )}
                >
                    <div
                        className={cn(
                            'flex size-12 shrink-0 items-center justify-center rounded-full',
                            isExpiringSoon ? 'bg-[#FFF0F0] text-[#B42318]' : 'bg-[#FFF4D6] text-[#A56600]',
                        )}
                    >
                        {isExpiringSoon ? <TriangleAlert className="size-6" /> : <Clock3 className="size-6" />}
                    </div>
                    <div>
                        <p className="font-apple text-sm font-medium text-sub-2.5">{t('feature.auth.demoSession.remainingLabel')}</p>
                        <p className="mt-1 font-apple text-[1.875rem] leading-none font-semibold tracking-[-0.04em] text-sub-1">
                            {sessionInfo?.countdownLabel ?? '--:--'}
                        </p>
                        <p className="mt-1 font-apple text-sm text-sub-2.5">
                            {sessionInfo
                                ? t('feature.auth.demoSession.remainingApprox', {minutes: sessionInfo.remainingRoundedMinutes})
                                : t('feature.auth.demoSession.remainingFallback')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoSessionBanner;
