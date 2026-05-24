import {cn} from '@dutying/utils/style';
import {CircleUserRound, MessageSquareText, SlidersHorizontal, UsersRound} from 'lucide-react';
import {type ComponentType, type SVGProps} from 'react';
import useEditWard from '@/features/edit-ward';
import ROUTE, {type TRoute} from '@/shared/constant/path';
import {type TI18nKey, useTypedTranslation} from '@/shared/hook/use-typed-translation';
import NavigationBarItem from './NavigationBarItem';

type TNavItem = {
    path?: TRoute;
    activePaths?: TRoute[];
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    selectedIcon?: ComponentType<SVGProps<SVGSVGElement>>;
    textKey: TI18nKey;
    disabled?: boolean;
};

type TNavSection = {
    labelKey: TI18nKey;
    items: TNavItem[];
};

const ScheduleIconOff = ({className}: SVGProps<SVGSVGElement>) => (
    <img src="/img/schedule-icon-off.png" alt="" aria-hidden="true" className={cn('!size-[23px] object-contain', className)} />
);
const ScheduleIconOn = ({className}: SVGProps<SVGSVGElement>) => (
    <img src="/img/schedule-icon-on.png" alt="" aria-hidden="true" className={cn('!size-[23px] object-contain', className)} />
);
const RequestShiftIconOff = ({className}: SVGProps<SVGSVGElement>) => (
    <img src="/img/request-icon-off.png" alt="" aria-hidden="true" className={cn('!size-[23px] object-contain', className)} />
);
const RequestShiftIconOn = ({className}: SVGProps<SVGSVGElement>) => (
    <img src="/img/request-icon-on.png" alt="" aria-hidden="true" className={cn('!size-[23px] object-contain', className)} />
);
const sections: TNavSection[] = [
    {
        labelKey: 'page.navigationBar.sections.operations',
        items: [
            {
                path: ROUTE.MAKE,
                activePaths: [ROUTE.MAKE, ROUTE.DUTY],
                icon: ScheduleIconOff,
                selectedIcon: ScheduleIconOn,
                textKey: 'page.navigationBar.items.make',
            },
            {
                path: ROUTE.REQUEST,
                icon: RequestShiftIconOff,
                selectedIcon: RequestShiftIconOn,
                textKey: 'page.navigationBar.items.request',
            },
            {
                path: ROUTE.BOARD,
                icon: MessageSquareText,
                textKey: 'page.navigationBar.items.board',
            },
        ],
    },
    {
        labelKey: 'page.navigationBar.sections.settings',
        items: [
            {
                path: ROUTE.MEMBER,
                icon: UsersRound,
                textKey: 'page.navigationBar.items.member',
            },
            {
                path: ROUTE.WARD_SETTINGS,
                icon: SlidersHorizontal,
                textKey: 'page.navigationBar.items.wardSettings',
            },
            {
                path: ROUTE.PROFILE,
                icon: CircleUserRound,
                textKey: 'page.navigationBar.items.account',
            },
        ],
    },
];

type TNavigationBarItemGroupsProps = {
    collapsed?: boolean;
};

const NavigationBarItemGroups = ({collapsed = false}: TNavigationBarItemGroupsProps) => {
    const {t} = useTypedTranslation();
    const {
        state: {watingNurses},
    } = useEditWard();
    const waitingCount = watingNurses?.length ?? 0;

    return (
        <nav aria-label={t('page.navigationBar.ariaLabel')} className={cn('w-full', collapsed ? 'mt-5' : 'mt-6')}>
            {sections.map((section) => (
                <div key={section.labelKey} className={cn(collapsed ? 'mt-4 first:mt-0' : 'mt-7 first:mt-0')}>
                    <div className={cn('h-px bg-gray-6', collapsed ? 'mx-auto mb-4 w-8' : 'mb-4 w-full')} />
                    {collapsed ? null : <div className="px-3 pb-2 text-[12px] font-semibold text-gray-4">{t(section.labelKey)}</div>}
                    <div className={cn('flex flex-col', collapsed ? 'gap-2' : 'gap-1.5')}>
                        {section.items.map((item) => (
                            <NavigationBarItem
                                key={item.path ?? item.textKey}
                                path={item.path}
                                activePaths={item.activePaths}
                                Icon={item.icon}
                                SelectedIcon={item.selectedIcon}
                                text={t(item.textKey)}
                                collapsed={collapsed}
                                disabled={item.disabled}
                                badgeCount={item.path === ROUTE.MEMBER ? waitingCount : 0}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
};

export default NavigationBarItemGroups;
