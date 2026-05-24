import {cn} from '@dutying/utils/style';
import {HistoryBackIcon, HistoryNextIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {getAiAutofillActionLabel, type TAiAutofillStatus} from '../../../model/ai-autofill-state';

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

/**
 * 상단 툴바: 신청 근무 확정 탭과 같이 제목 + 보조 문구(좌), 컨트롤(우).
 */
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
    aiStatus,
    hasCompletedAiFill,
    onConfirm,
    canConfirm,
}: TAiAutofillToolbarProps) {
    const {t} = useTypedTranslation();
    const aiActionKey = getAiAutofillActionLabel(aiStatus, hasCompletedAiFill);

    return (
        <div className="ai-autofill-toolbar flex w-full min-w-0 flex-wrap items-start justify-between gap-3">
            <div className="ai-autofill-toolbar__titles min-w-0">
                <h1 className="ai-autofill-toolbar__title shrink-0 font-apple text-[28px] leading-tight font-bold whitespace-nowrap text-sub-1">
                    {t('page.makeShift.aiRefill.toolbarTitle')}
                </h1>
                <p className="ai-autofill-toolbar__subtitle mt-4 font-apple text-[16px] leading-[28px] font-medium text-gray-3">
                    {t('page.makeShift.aiRefill.toolbarSubTitle')}
                </p>
            </div>

            <div id="make_ai_autofill_actions" className="ai-autofill-toolbar__actions flex shrink-0 items-center gap-2">
                <ToggleChip
                    className="ai-autofill-toolbar__toggle ai-autofill-toolbar__toggle--auto-fill"
                    active={autoFillEnabled}
                    onClick={onToggleAutoFill}
                >
                    {t(autoFillEnabled ? 'page.makeShift.aiRefill.viewAll' : 'page.makeShift.aiRefill.fixedOnly')}
                </ToggleChip>

                <ToggleChip
                    className="ai-autofill-toolbar__toggle ai-autofill-toolbar__toggle--faults"
                    active={showFaults}
                    onClick={onToggleFaults}
                >
                    <span
                        className={cn(
                            'ai-autofill-toolbar__fault-swatches flex shrink-0 items-center gap-[1px] transition-opacity',
                            showFaults ? 'opacity-100' : 'opacity-0',
                        )}
                        aria-hidden
                    >
                        <span className="ai-autofill-toolbar__fault-swatch--error size-[clamp(8px,0.65vw,12px)] rounded-[2px] bg-[#FF000080]" />
                        <span className="ai-autofill-toolbar__fault-swatch--medium size-[clamp(8px,0.65vw,12px)] rounded-[2px] bg-[#FF88004D]" />
                        <span className="ai-autofill-toolbar__fault-swatch--warning size-[clamp(8px,0.65vw,12px)] rounded-[2px] bg-[#EEFF004D]" />
                    </span>
                    {t(showFaults ? 'page.makeShift.aiRefill.showingFaults' : 'page.makeShift.aiRefill.hidingFaults')}
                </ToggleChip>

                <span className="ai-autofill-toolbar__divider mx-1 inline-flex h-5 w-px shrink-0 bg-gray-6" aria-hidden />

                <span className="ai-autofill-toolbar__history flex items-center gap-[2px]">
                    <IconButton className="ai-autofill-toolbar__history-undo" onClick={onUndo} disabled={!canUndo} ariaLabel="undo">
                        <HistoryBackIcon className="size-full" />
                    </IconButton>
                    <IconButton className="ai-autofill-toolbar__history-redo" onClick={onRedo} disabled={!canRedo} ariaLabel="redo">
                        <HistoryNextIcon className="size-full" />
                    </IconButton>
                </span>

                <span className="ai-autofill-toolbar__divider mx-1 inline-flex h-5 w-px shrink-0 bg-gray-6" aria-hidden />

                <button
                    type="button"
                    onClick={onAiFill}
                    disabled={isAiGenerating}
                    className={cn(
                        'ai-autofill-toolbar__cta ai-autofill-toolbar__cta--ai-fill',
                        'box-border inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-gray-7 px-4 py-0',
                        'font-apple text-sm leading-none font-semibold whitespace-nowrap text-sub-1',
                        'hover:bg-gray-6/60 disabled:cursor-not-allowed disabled:opacity-60',
                    )}
                >
                    {t(`page.makeShift.aiRefill.${aiActionKey}`)}
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={!canConfirm}
                    className={cn(
                        'ai-autofill-toolbar__cta ai-autofill-toolbar__cta--confirm',
                        'box-border inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-[#0A0F15] px-4 py-0',
                        'font-apple text-sm leading-none font-semibold whitespace-nowrap text-white',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                >
                    {t('page.makeShift.aiRefill.confirm')}
                </button>
            </div>
        </div>
    );
}

function ToggleChip({
    active,
    onClick,
    className,
    children,
}: {
    active: boolean;
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'box-border inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] whitespace-nowrap',
                'px-3 py-0 font-apple text-[12px] leading-none font-semibold',
                active ? 'bg-sub-1 text-white' : 'bg-gray-7 text-gray-4 opacity-90',
                className,
            )}
        >
            {children}
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
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn(
                'grid size-8 shrink-0 cursor-pointer place-items-center rounded-[10px] text-sub-2.5 hover:bg-gray-7 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
                className,
            )}
        >
            {children}
        </button>
    );
}
