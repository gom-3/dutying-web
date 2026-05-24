import {cn} from '@dutying/utils/style';
import {type ComponentType, type SVGProps} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {events, sendEvent} from '@/analytics';
import {type TRoute} from '@/shared/constant/path';

interface INavigationBarItemProps {
    path?: TRoute;
    activePaths?: TRoute[];
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    SelectedIcon?: ComponentType<SVGProps<SVGSVGElement>>;
    text: string;
    collapsed?: boolean;
    disabled?: boolean;
    badgeCount?: number;
}

const NavigationBarItem = ({
    path,
    activePaths,
    Icon,
    SelectedIcon,
    text,
    collapsed = false,
    disabled = false,
    badgeCount = 0,
}: INavigationBarItemProps) => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const isSelected = Boolean(path) && (activePaths ?? [path]).some((activePath) => activePath === pathname);
    const isDisabled = disabled || !path;
    const badgeLabel = badgeCount > 99 ? '99+' : String(badgeCount);
    const CurrentIcon = isSelected && SelectedIcon ? SelectedIcon : Icon;

    return (
        <button
            type="button"
            title={collapsed ? text : undefined}
            aria-label={collapsed ? text : undefined}
            aria-current={isSelected ? 'page' : undefined}
            aria-disabled={isDisabled ? true : undefined}
            disabled={isDisabled}
            className={cn(
                'group relative flex min-h-11 w-full items-center rounded-[10px] font-apple text-[15px] leading-normal font-semibold transition-colors duration-150',
                'focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none',
                collapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3',
                isSelected ? 'bg-main-light text-[#844AFF]' : 'text-gray-3 hover:bg-gray-7 hover:text-sub-1',
                isDisabled ? 'cursor-not-allowed opacity-45 hover:bg-transparent hover:text-gray-3' : 'cursor-pointer',
            )}
            onClick={() => {
                if (isDisabled) return;

                navigate(path);
                sendEvent(events.navigationBar.navigate, path);
            }}
        >
            {isSelected ? (
                <span
                    aria-hidden="true"
                    className={cn('absolute left-0 w-[3px] rounded-r-full bg-[#844AFF]', collapsed ? 'top-[11px] h-[22px]' : 'top-2.5 h-6')}
                />
            ) : null}
            <CurrentIcon
                className={cn('size-5 shrink-0', isSelected ? 'text-[#844AFF]' : 'text-gray-4 group-hover:text-sub-1')}
                aria-hidden="true"
            />
            {collapsed ? null : <span className="min-w-0 flex-1 truncate text-left">{text}</span>}
            {badgeCount > 0 ? (
                <span
                    className={cn(
                        'absolute flex min-w-3.5 items-center justify-center rounded-full bg-[#E55C6E] px-1 font-poppins text-[8px] leading-[14px] text-white',
                        collapsed ? 'top-1 right-1' : 'top-[7px] right-2',
                    )}
                    aria-hidden="true"
                >
                    {badgeLabel}
                </span>
            ) : null}
        </button>
    );
};

export default NavigationBarItem;
