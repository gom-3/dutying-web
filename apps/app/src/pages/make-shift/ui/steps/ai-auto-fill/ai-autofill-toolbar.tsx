import {cn} from '@dutying/utils/style';
import {AlertTriangle, Check, Eye, EyeOff, Redo2, Undo2, type LucideIcon} from 'lucide-react';
import type {ReactNode} from 'react';
import aiAutofillSparkleIcon from '@/shared/assets/images/ai-autofill-sparkle.png';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {type TAiAutofillStatus} from '../../../model/ai-autofill-state';

type TAiAutofillToolbarProps = {
    autoFillEnabled: boolean;
    onToggleAutoFill: () => void;
    showFaults: boolean;
    onToggleFaults: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onAiFill: () => void;
    isAiGenerating: boolean;
    aiStatus: TAiAutofillStatus;
    hasCompletedAiFill: boolean;
    onConfirm: () => void;
    canConfirm: boolean;
};

export function AiAutofillToolbar({
    autoFillEnabled,
    onToggleAutoFill,
    showFaults,
    onToggleFaults,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onAiFill,
    isAiGenerating,
    onConfirm,
    canConfirm,
}: TAiAutofillToolbarProps) {
    const {t} = useTypedTranslation();

    return (
        <div className="ai-autofill-toolbar flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="ai-autofill-toolbar__titles min-w-0">
                <h1 className="ai-autofill-toolbar__title shrink-0 font-apple text-[28px] leading-tight font-bold whitespace-nowrap text-sub-1">
                    {t('page.makeShift.aiRefill.toolbarTitle')}
                </h1>
                <p className="ai-autofill-toolbar__subtitle mt-4 font-apple text-[16px] leading-[28px] font-medium text-gray-3">
                    {t('page.makeShift.aiRefill.toolbarSubTitle')}
                </p>
            </div>

            <div
                id="make_ai_autofill_actions"
                className="ai-autofill-toolbar__actions ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2"
            >
                <div className="ai-autofill-toolbar__view-actions flex min-h-[43px] shrink-0 items-center gap-1 rounded-[13px] bg-gray-7 px-1">
                    <ToggleIconButton
                        className="ai-autofill-toolbar__toggle ai-autofill-toolbar__toggle--auto-fill"
                        active={autoFillEnabled}
                        onClick={onToggleAutoFill}
                        ariaLabel={t(autoFillEnabled ? 'page.makeShift.aiRefill.viewAll' : 'page.makeShift.aiRefill.fixedOnly')}
                        icon={autoFillEnabled ? Eye : EyeOff}
                    />

                    <ToggleIconButton
                        className="ai-autofill-toolbar__toggle ai-autofill-toolbar__toggle--faults"
                        active={showFaults}
                        onClick={onToggleFaults}
                        ariaLabel={t(showFaults ? 'page.makeShift.aiRefill.showingFaults' : 'page.makeShift.aiRefill.hidingFaults')}
                        icon={AlertTriangle}
                    />
                </div>

                <span className="ai-autofill-toolbar__history flex min-h-[43px] items-center gap-1 rounded-[13px] bg-gray-7 px-1">
                    <IconButton className="ai-autofill-toolbar__history-undo" onClick={onUndo} disabled={!canUndo} ariaLabel="Undo">
                        <Undo2 className="size-3.5" aria-hidden />
                    </IconButton>
                    <IconButton className="ai-autofill-toolbar__history-redo" onClick={onRedo} disabled={!canRedo} ariaLabel="Redo">
                        <Redo2 className="size-3.5" aria-hidden />
                    </IconButton>
                </span>

                <button
                    type="button"
                    onClick={onAiFill}
                    disabled={isAiGenerating}
                    aria-busy={isAiGenerating}
                    className={cn(
                        'ai-autofill-toolbar__cta ai-autofill-toolbar__cta--ai-fill',
                        'inline-flex min-h-[43px] min-w-[142px] cursor-pointer items-center justify-center gap-2 rounded-[13px] px-4 py-0',
                        'bg-[linear-gradient(90deg,#C241F4_0%,#6B45F4_100%)] font-apple text-[13px] leading-none font-bold whitespace-nowrap text-white',
                        'transition-[filter,transform] duration-150',
                        'hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[#A978FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99] active:brightness-95',
                        'disabled:cursor-not-allowed disabled:opacity-60 disabled:grayscale',
                    )}
                >
                    <img src={aiAutofillSparkleIcon} alt="" aria-hidden className="size-4 shrink-0 object-contain" />
                    <span className="truncate">AI 자동 채우기</span>
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={!canConfirm}
                    className={cn(
                        'ai-autofill-toolbar__cta ai-autofill-toolbar__cta--confirm',
                        'inline-flex min-h-[43px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[13px] bg-[#34383F] px-4 py-0',
                        'font-apple text-[13px] leading-none font-bold whitespace-nowrap text-white transition-colors duration-150',
                        'hover:bg-[#2B3036] focus-visible:ring-2 focus-visible:ring-main-2 focus-visible:ring-offset-2 focus-visible:outline-none active:bg-[#24282E]',
                        'disabled:cursor-not-allowed disabled:bg-gray-5 disabled:text-white/70',
                    )}
                >
                    <Check className="size-3.5" strokeWidth={2.4} aria-hidden />
                    {t('page.makeShift.aiRefill.confirm')}
                </button>
            </div>
        </div>
    );
}

function ToggleIconButton({
    active,
    onClick,
    ariaLabel,
    className,
    icon: Icon,
}: {
    active: boolean;
    onClick: () => void;
    ariaLabel: string;
    className?: string;
    icon: LucideIcon;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={active}
            className={cn(
                'grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] transition-colors duration-150',
                'hover:bg-white hover:text-sub-1 focus-visible:ring-2 focus-visible:ring-main-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                active ? 'bg-white text-sub-1' : 'text-gray-3',
                className,
            )}
        >
            <Icon className="size-3.5" aria-hidden />
        </button>
    );
}

function IconButton({
    onClick,
    disabled,
    ariaLabel,
    className,
    children,
}: {
    onClick: () => void;
    disabled?: boolean;
    ariaLabel: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn(
                'grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] text-gray-3 transition-colors duration-150',
                'hover:bg-white hover:text-sub-1 focus-visible:ring-2 focus-visible:ring-main-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-3',
                className,
            )}
        >
            {children}
        </button>
    );
}
