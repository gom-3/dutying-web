import {cn} from '@dutying/utils/style';
import {type TI18nKey, useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {type TMakeShiftStep} from '../model/make-shift-store';

type TStepState = 'done' | 'current' | 'available' | 'locked';
type TStepMeta = {
    labelKey: TI18nKey;
    captionKey: TI18nKey;
};

const MAKE_SHIFT_STEPS: TMakeShiftStep[] = [1, 2, 3, 4, 5, 6];
const MAKE_SHIFT_STEP_META: Record<TMakeShiftStep, TStepMeta> = {
    1: {
        labelKey: 'page.makeShift.steps.workers.label',
        captionKey: 'page.makeShift.steps.workers.caption',
    },
    2: {
        labelKey: 'page.makeShift.steps.constraints.label',
        captionKey: 'page.makeShift.steps.constraints.caption',
    },
    3: {
        labelKey: 'page.makeShift.steps.requests.label',
        captionKey: 'page.makeShift.steps.requests.caption',
    },
    4: {
        labelKey: 'page.makeShift.steps.fixedShifts.label',
        captionKey: 'page.makeShift.steps.fixedShifts.caption',
    },
    5: {
        labelKey: 'page.makeShift.steps.aiAutofill.label',
        captionKey: 'page.makeShift.steps.aiAutofill.caption',
    },
    6: {
        labelKey: 'page.makeShift.steps.confirmedShifts.label',
        captionKey: 'page.makeShift.steps.confirmedShifts.caption',
    },
};

function getStepState(step: TMakeShiftStep, currentStep: TMakeShiftStep, maxReachedStep: TMakeShiftStep): TStepState {
    if (step < currentStep) return 'done';

    if (step === currentStep) return 'current';

    return step <= maxReachedStep ? 'available' : 'locked';
}

function StepConnector({active, side}: {active: boolean; side: 'left' | 'right'}) {
    return (
        <span
            aria-hidden
            className={cn(
                'absolute top-[13px] h-0.5 overflow-hidden bg-gray-6',
                side === 'left' ? 'right-[calc(50%+20px)] left-0' : 'right-0 left-[calc(50%+20px)]',
            )}
        >
            <span
                className={cn(
                    'block h-full bg-[#DCD2FF] transition-transform duration-300 ease-out motion-reduce:transition-none',
                    side === 'left' ? 'origin-right' : 'origin-left',
                    active ? 'scale-x-100' : 'scale-x-0',
                )}
            />
        </span>
    );
}

function StepCheckIcon() {
    return (
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5">
            <path
                d="M3.5 8.1 6.5 11 12.5 5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.1"
            />
        </svg>
    );
}

export function MakeShiftStepper({
    currentStep,
    maxReachedStep,
    onClickStep,
}: {
    currentStep: TMakeShiftStep;
    maxReachedStep: TMakeShiftStep;
    onClickStep: (step: TMakeShiftStep) => void;
}) {
    const {t} = useTypedTranslation();
    const isConfirmedStep = currentStep === 6;
    const showConfirmedStep = isConfirmedStep || maxReachedStep >= 6;

    return (
        <nav id="make_stepper" className="make-shift-stepper w-full px-3 pt-8" aria-label={t('page.makeShift.progress.ariaLabel')}>
            <div className="relative pb-6 after:absolute after:right-6 after:bottom-0 after:left-6 after:h-px after:bg-gray-7 after:content-['']">
                <ol
                    className="grid px-1 transition-[grid-template-columns] duration-300 ease-out motion-reduce:transition-none"
                    style={{
                        gridTemplateColumns: showConfirmedStep ? 'repeat(6, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr)) minmax(0, 0fr)',
                    }}
                >
                    {MAKE_SHIFT_STEPS.map((step) => {
                        const stepMeta = MAKE_SHIFT_STEP_META[step];
                        const state = getStepState(step, currentStep, maxReachedStep);
                        const isFinalConfirmedStep = step === 6 && state === 'current';
                        const isStepHidden = step === 6 && !showConfirmedStep;
                        const clickable = !isConfirmedStep && step !== currentStep && state !== 'locked';
                        const showRightConnector = step !== 6 && (step !== 5 || showConfirmedStep);

                        return (
                            <li
                                key={step}
                                className={cn(
                                    'relative flex min-w-0 justify-center transition-[opacity,transform,max-width] duration-300 ease-out motion-reduce:transition-none',
                                    isStepHidden
                                        ? 'pointer-events-none max-w-0 scale-90 overflow-hidden opacity-0'
                                        : 'max-w-[999px] scale-100 overflow-visible opacity-100',
                                )}
                            >
                                {step !== 1 && <StepConnector side="left" active={step <= currentStep} />}
                                {showRightConnector && <StepConnector side="right" active={step < currentStep} />}
                                <button
                                    type="button"
                                    disabled={state === 'locked' || isConfirmedStep}
                                    onClick={() => clickable && onClickStep(step)}
                                    data-step={step}
                                    data-step-state={state}
                                    aria-current={state === 'current' ? 'step' : undefined}
                                    className={cn(
                                        'group relative z-10 flex w-full min-w-0 flex-col items-center gap-2.5 px-1 text-center transition-colors duration-200 ease-out',
                                        state === 'done' && 'text-sub-2',
                                        state === 'current' && (isFinalConfirmedStep ? 'text-[#167A52]' : 'text-main-1'),
                                        state === 'available' && 'text-sub-2',
                                        state === 'locked' && 'cursor-not-allowed text-gray-4',
                                        clickable ? 'cursor-pointer' : 'cursor-default',
                                    )}
                                >
                                    <span className="grid size-7 place-items-center">
                                        <span
                                            className={cn(
                                                'grid place-items-center rounded-[8px] font-poppins leading-none font-semibold transition-[background-color,color,transform] duration-300 ease-out motion-reduce:transition-none',
                                                state === 'current'
                                                    ? `size-7 ${isFinalConfirmedStep ? 'bg-[#20A66A]' : 'bg-main-1'} text-[12px] text-white`
                                                    : 'size-6 text-[11px]',
                                                state === 'current' && 'motion-safe:scale-110',
                                                state === 'done' && 'bg-[#DCD2FF] text-main-1 group-hover:motion-safe:scale-105',
                                                state === 'available' &&
                                                    'bg-main-light text-main-1 group-hover:bg-main-1 group-hover:text-white group-hover:motion-safe:scale-105',
                                                state === 'locked' && 'bg-gray-7 text-gray-4',
                                            )}
                                        >
                                            {state === 'done' || isFinalConfirmedStep ? <StepCheckIcon /> : step}
                                        </span>
                                    </span>
                                    <span className="flex max-w-full min-w-0 flex-col items-center gap-1">
                                        <span
                                            className={cn(
                                                'max-w-full min-w-0 truncate font-apple text-[12px] leading-none font-semibold transition-[color,transform] duration-200 ease-out motion-reduce:transition-none',
                                                state === 'current' &&
                                                    `${isFinalConfirmedStep ? 'text-[#167A52]' : 'text-main-1'} motion-safe:-translate-y-0.5`,
                                                state === 'locked' && 'text-gray-4',
                                            )}
                                        >
                                            {t(stepMeta.labelKey)}
                                        </span>
                                        <span
                                            className={cn(
                                                'max-w-full min-w-0 translate-y-1 truncate font-apple text-[11px] leading-none font-medium text-gray-4 opacity-0 transition-[color,opacity,transform] duration-200',
                                                'group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
                                                state === 'current' &&
                                                    `translate-y-0 opacity-100 ${isFinalConfirmedStep ? 'text-[#167A52]/70' : 'text-main-1/70'}`,
                                                state === 'locked' && 'text-gray-4',
                                            )}
                                        >
                                            {t(stepMeta.captionKey)}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
