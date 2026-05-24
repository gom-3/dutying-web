import {
    AccountIcon,
    AccountIconSelected,
    DutyIcon,
    DutyIconSelected,
    NurseIcon,
    NurseIconSelected,
    RequestIcon,
    RequestIconSelected,
    SettingIcon,
    SettingIconSelected,
} from '@/shared/assets/svg';
import ROUTE, {type TRoute} from '@/shared/constant/path';
import {type TI18nKey, useTypedTranslation} from '@/shared/hook/use-typed-translation';
import useEditWard from '@/features/edit-ward';
import NavigationBarItem from './NavigationBarItem';

type TNavItem = {
    path?: TRoute;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    selectedIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    textKey: TI18nKey;
    disabled?: boolean;
};

type TNavSection = {
    labelKey: TI18nKey;
    items: TNavItem[];
};

const sections: TNavSection[] = [
    {
        labelKey: 'page.navigationBar.sections.schedule',
        items: [
            {
                path: ROUTE.MAKE,
                icon: DutyIcon,
                selectedIcon: DutyIconSelected,
                textKey: 'page.navigationBar.items.make',
            },
            {
                path: ROUTE.REQUEST,
                icon: RequestIcon,
                selectedIcon: RequestIconSelected,
                textKey: 'page.navigationBar.items.request',
            },
        ],
    },
    {
        labelKey: 'page.navigationBar.sections.settings',
        items: [
            {
                path: ROUTE.MEMBER,
                icon: NurseIcon,
                selectedIcon: NurseIconSelected,
                textKey: 'page.navigationBar.items.member',
            },
            {
                path: ROUTE.WARD_SETTINGS,
                icon: SettingIcon,
                selectedIcon: SettingIconSelected,
                textKey: 'page.navigationBar.items.wardSettings',
            },
            {
                path: ROUTE.PROFILE,
                icon: AccountIcon,
                selectedIcon: AccountIconSelected,
                textKey: 'page.navigationBar.items.account',
            },
        ],
    },
];
const NavigationBarItemGroups = () => {
    const {t} = useTypedTranslation();
    const {
        state: {watingNurses},
    } = useEditWard();
    const waitingCount = watingNurses?.length ?? 0;

    return (
        <nav className="w-full">
            {sections.map((section) => (
                <div key={section.labelKey}>
                    <div className="my-6 h-px w-full bg-gray-6" />
                    <div className="px-[20px] pb-[14px] text-[14px] font-medium text-gray-4">{t(section.labelKey)}</div>
                    <div className="mt-2 flex flex-col gap-2 px-[2px]">
                        {section.items.map((item) => (
                            <NavigationBarItem
                                key={item.path ?? item.textKey}
                                path={item.path}
                                Icon={item.icon}
                                SelectedIcon={item.selectedIcon}
                                text={t(item.textKey)}
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
