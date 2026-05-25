import {BouncingDots} from '@/components/loading-ui/bouncing-dots';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Button from '@/shared/ui/form-controls/Button';
import PageState from '@/shared/ui/PageState';
import {type TMakeShiftStep} from '../model/make-shift-store';
import {MAKE_SHIFT_STEP_CONFIG} from './make-shift-step-config';
import {MAKE_SHIFT_STEP_NAV_BUTTON_CLASS} from './make-shift-step-nav';
import {useFlowTransitionFeedback} from './use-flow-transition-feedback';

type TMakeShiftStepContentProps = {
    currentStep: TMakeShiftStep;
    canPrev: boolean;
    canNext: boolean;
    onPrev: () => void;
    onNext: () => void;
};

export function MakeShiftStepContent({currentStep, canPrev, canNext, onPrev, onNext}: TMakeShiftStepContentProps) {
    const {t} = useTypedTranslation();
    const {transitioning, runTransition} = useFlowTransitionFeedback();
    const stepConfig = MAKE_SHIFT_STEP_CONFIG[currentStep];

    if (!stepConfig) {
        return (
            <div className="make-shift-step-content flex w-full min-w-0 flex-1 items-center justify-center pb-3">
                <PageState
                    tone="error"
                    title={t('page.makeShift.stepLoadFailed')}
                    description={t('page.state.errorDescription')}
                    className="py-0"
                />
            </div>
        );
    }

    const StepComponent = stepConfig.Component;

    if (stepConfig.layout === 'wide') {
        const widePtClass = currentStep === 3 ? 'pt-3' : '';

        return (
            <div
                className={`make-shift-step-content make-shift-step-content--wide flex w-full min-w-0 flex-1 flex-col pb-3 ${widePtClass}`}
            >
                <p className="sr-only">{t(stepConfig.labelKey)}</p>
                <StepComponent />
            </div>
        );
    }

    const intro = stepConfig.intro;

    return (
        <div className="make-shift-step-content make-shift-step-content--narrow flex w-full min-w-0 flex-1 gap-4 pt-7 pb-3">
            <aside className="make-shift-step-content__intro flex w-[clamp(292px,25vw,360px)] shrink-0 flex-col justify-between px-1 py-2">
                <div>
                    <p className="make-shift-step-content__intro-title font-apple text-[28px] leading-tight font-bold text-sub-1">
                        {intro ? t(intro.titleKey) : ''}
                    </p>
                    {intro && (
                        <p className="mt-4 font-apple text-[16px] leading-[28px] font-medium whitespace-pre-line text-gray-3">
                            {t(intro.descriptionKey)}
                        </p>
                    )}
                </div>

                <div className="make-shift-step-content__intro-actions mt-8 flex items-center justify-end gap-2">
                    {currentStep > 1 && (
                        <Button
                            variant="secondary"
                            size="md"
                            type="button"
                            onClick={() => runTransition('prev', onPrev)}
                            disabled={!canPrev || transitioning !== null}
                            className={`cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                        >
                            {transitioning === 'prev' ? <BouncingDots className="w-5 shrink-0 text-main-1" /> : null}
                            {transitioning === 'prev' ? t('page.makeShift.navigation.moving') : t('page.makeShift.navigation.previous')}
                        </Button>
                    )}
                    <Button
                        size="md"
                        type="button"
                        onClick={() => runTransition('next', onNext)}
                        disabled={!canNext || transitioning !== null}
                        className={`cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                    >
                        {transitioning === 'next' ? <BouncingDots className="w-5 shrink-0 text-white" /> : null}
                        {transitioning === 'next' ? t('page.makeShift.navigation.moving') : t('page.makeShift.navigation.next')}
                    </Button>
                </div>
            </aside>

            <div className="make-shift-step-content__main min-w-0 flex-1">
                <p className="sr-only">{t(stepConfig.labelKey)}</p>
                <StepComponent />
            </div>
        </div>
    );
}
