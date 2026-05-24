import {cn} from '@dutying/utils/style';
import type {ReactNode} from 'react';
import type {TOnboardingStep} from '../model';
import WizardButton from './wizard-button';

interface IOnboardingStepLayoutProps {
    step: TOnboardingStep;
    onPrev: () => void;
    onNext: () => void;
    onNextDisabledClick?: () => void;
    leftAction?: ReactNode;
    nextDisabled?: boolean;
    actionsDisabled?: boolean;
    nextLabel?: string;
    children: ReactNode;
}

function OnboardingStepLayout({
    step,
    onPrev,
    onNext,
    onNextDisabledClick,
    leftAction,
    nextDisabled = false,
    actionsDisabled = false,
    nextLabel,
    children,
}: IOnboardingStepLayoutProps) {
    return (
        <>
            {children}
            <div className="mt-14 flex items-center justify-between">
                {leftAction ?? <div />}
                <div className="flex items-center gap-[42px]">
                    {step > 1 ? (
                        <WizardButton variant="secondary" onClick={onPrev} disabled={actionsDisabled}>
                            이전
                        </WizardButton>
                    ) : null}
                    <WizardButton
                        onClick={() => {
                            if (nextDisabled) {
                                onNextDisabledClick?.();

                                return;
                            }

                            onNext();
                        }}
                        aria-disabled={nextDisabled}
                        className={cn(
                            nextDisabled && 'border-0 bg-[#EFEAFF] text-[#A69BCF] hover:bg-[#EFEAFF] hover:text-[#A69BCF] active:scale-100',
                        )}
                    >
                        {nextLabel ?? (step < 4 ? '다음' : '완료')}
                    </WizardButton>
                </div>
            </div>
        </>
    );
}

export default OnboardingStepLayout;
