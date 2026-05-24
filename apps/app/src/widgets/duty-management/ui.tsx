import {cn} from '@dutying/utils/style';
import {cva, type VariantProps} from 'class-variance-authority';
import * as React from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@/shared/assets/svg';
import {buttonVariants} from '@/shared/ui/primitives/button';

type TTeam = {
    shiftTeamId: number;
    name: string;
};

type TMonthTeamHeaderProps = {
    year: number;
    month: number;
    prevLabel: string;
    nextLabel: string;
    shiftTeams: TTeam[];
    currentShiftTeamId: number | null;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onSelectShiftTeam: (shiftTeamId: number) => void;
    emptyLabel: string;
    formatMonthLabel: (year: number, month: number) => string;
    disabled?: boolean;
    /** Disable moving to a previous month when the caller owns month policy. */
    prevMonthDisabled?: boolean;
    /** Disable moving to a next month when the caller owns month policy. */
    nextMonthDisabled?: boolean;
    teamTone?: 'default' | 'darkSegmented';
};

const managementActionVariants = cva(
    cn(
        buttonVariants({
            size: 'default',
        }),
        'rounded-[10px] border-0 font-apple font-semibold shadow-none',
    ),
    {
        variants: {
            variant: {
                primary: 'bg-main-1 text-white hover:bg-main-2',
                secondary: 'bg-main-light text-main-1 hover:bg-main-4',
                neutral: 'bg-gray-6 text-gray-3 hover:bg-gray-5',
                outline: 'border border-main-1 bg-transparent text-main-1 hover:bg-main-light',
                ghost: 'bg-transparent text-gray-4 hover:bg-gray-7 hover:text-sub-1',
            },
            size: {
                sm: 'h-[42px] px-5 text-base',
                md: 'h-10 px-4 text-xl font-medium',
                lg: 'rounded-[20px] px-[42px] py-[22px] text-2xl',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

type TActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof managementActionVariants>;

export function ManagementActionButton({className, variant, size, ...props}: TActionButtonProps) {
    return <button type="button" className={cn(managementActionVariants({variant, size}), className)} {...props} />;
}

export function DutyManagementMonthTeamHeader({
    year,
    month,
    prevLabel,
    nextLabel,
    shiftTeams,
    currentShiftTeamId,
    onPrevMonth,
    onNextMonth,
    onSelectShiftTeam,
    emptyLabel,
    formatMonthLabel,
    disabled = false,
    prevMonthDisabled = false,
    nextMonthDisabled = false,
    teamTone = 'default',
}: TMonthTeamHeaderProps) {
    const isDarkSegmented = teamTone === 'darkSegmented';
    const shouldShowTeamSwitcher = shiftTeams.length !== 1;

    return (
        <div className={cn('flex flex-wrap items-center', isDarkSegmented ? 'gap-2' : 'gap-4')}>
            <div className={cn('flex items-center', isDarkSegmented ? 'gap-1' : 'gap-2')}>
                <button
                    type="button"
                    className={cn(
                        'grid size-9 place-items-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
                        isDarkSegmented
                            ? 'rounded-full text-gray-4 hover:bg-gray-7 hover:text-sub-1 disabled:hover:text-gray-4'
                            : 'rounded-[10px] text-gray-5 hover:bg-main-light hover:text-main-1 disabled:hover:text-gray-5',
                    )}
                    onClick={onPrevMonth}
                    disabled={disabled || prevMonthDisabled}
                    aria-label={prevLabel}
                >
                    <ChevronLeftIcon />
                </button>
                <div
                    className={cn(
                        'text-center font-apple font-semibold',
                        isDarkSegmented ? 'min-w-[112px] text-[20px] text-sub-1' : 'text-2xl text-main-1',
                    )}
                >
                    {formatMonthLabel(year, month)}
                </div>
                <button
                    type="button"
                    className={cn(
                        'grid size-9 place-items-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
                        isDarkSegmented
                            ? 'rounded-full text-gray-4 hover:bg-gray-7 hover:text-sub-1 disabled:hover:text-gray-4'
                            : 'rounded-[10px] text-gray-5 hover:bg-main-light hover:text-main-1 disabled:hover:text-gray-5',
                    )}
                    onClick={onNextMonth}
                    disabled={disabled || nextMonthDisabled}
                    aria-label={nextLabel}
                >
                    <ChevronRightIcon />
                </button>
            </div>

            {shouldShowTeamSwitcher ? (
                <div
                    className={cn(
                        'max-w-full',
                        isDarkSegmented ? 'rounded-[12px] bg-[#3D4658] p-0.5' : 'rounded-[10px] bg-main-light px-[10px] py-[7px]',
                    )}
                >
                    <div
                        className={cn(
                            'scrollbar-hide flex max-w-full gap-1 overflow-x-auto whitespace-nowrap',
                            isDarkSegmented && 'overflow-visible',
                        )}
                    >
                        {shiftTeams.map((team) => {
                            const selected = team.shiftTeamId === currentShiftTeamId;

                            return (
                                <button
                                    key={team.shiftTeamId}
                                    type="button"
                                    onClick={() => onSelectShiftTeam(team.shiftTeamId)}
                                    disabled={disabled}
                                    className={cn(
                                        isDarkSegmented
                                            ? cn(
                                                  'box-border grid h-8 max-h-8 min-h-8 min-w-[92px] place-items-center rounded-[9px] px-3 py-0 font-apple text-[12px] leading-none font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                                                  selected
                                                      ? 'bg-white text-sub-1'
                                                      : 'text-[#B8C0CF] hover:text-white disabled:hover:bg-transparent',
                                              )
                                            : cn(
                                                  'rounded-[8px] px-4 py-1.5 font-apple text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                                                  selected
                                                      ? 'bg-main-1 text-white'
                                                      : 'text-gray-3 hover:bg-white/70 disabled:hover:bg-transparent',
                                              ),
                                    )}
                                >
                                    <span className="block leading-none">{team.name}</span>
                                </button>
                            );
                        })}

                        {shiftTeams.length === 0 && (
                            <div
                                className={cn(
                                    'px-4 py-1.5 font-apple text-[14px] font-medium',
                                    isDarkSegmented ? 'text-[#AEB7C7]' : 'text-gray-3',
                                )}
                            >
                                {emptyLabel}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

type TStatusCardProps = {
    title: string;
    description?: string;
    descriptionClassName?: string;
    actions?: React.ReactNode;
    className?: string;
};

export function DutyManagementStatusCard({title, description, descriptionClassName, actions, className}: TStatusCardProps) {
    return (
        <div
            className={cn(
                'flex h-full min-h-[320px] flex-col items-center justify-center rounded-[20px] border border-dashed border-gray-6 bg-gray-7 px-8 py-10 text-center',
                className,
            )}
        >
            <p className="font-apple text-[28px] font-semibold text-sub-1">{title}</p>
            {description && (
                <p className={cn('mt-3 max-w-[480px] font-apple text-base leading-7 font-medium text-gray-3', descriptionClassName)}>
                    {description}
                </p>
            )}
            {actions && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
        </div>
    );
}
