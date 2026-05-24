import {type RefObject} from 'react';
import {twMerge} from 'tailwind-merge';
import {type ITutorialStepConfig} from './tutorial.types';

type TTutorialInfoBoxProps = {
    currentStep?: ITutorialStepConfig;
    infoBoxElement: RefObject<HTMLDivElement | null>;
    onNext: () => void;
    onPrevious: () => void;
    onSkip: () => void;
    stepIndex: number;
    totalSteps: number;
};

export function TutorialInfoBox({currentStep, infoBoxElement, onNext, onPrevious, onSkip, stepIndex, totalSteps}: TTutorialInfoBoxProps) {
    return (
        <div
            id="InfoBox"
            className="width-[20rem] absolute top-25 z-999 flex min-h-30 flex-col rounded-[.625rem] bg-white p-4 font-apple shadow-[5px_5px_15px_0px_rgba(149,81,146,0.3)]"
            ref={infoBoxElement}
        >
            <div className="flex flex-1 flex-col">
                <div id="InfoTitle" className="flex items-center">
                    <p className="truncate text-[1.25rem] font-semibold text-main-1">{currentStep?.title}</p>
                    <button className="ml-auto text-[.75rem] font-medium text-main-2 underline underline-offset-[.1rem]" onClick={onSkip}>
                        건너뛰기
                    </button>
                </div>
                <div id="InfoContent" className="mt-4 scrollbar-hide flex-1 overflow-y-scroll">
                    {currentStep?.info?.split('\n').map((line, index) => (
                        <p key={index} className="text-[1rem] font-medium text-sub-1">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
            <div id="BoxFooter" className="flex items-center justify-between">
                <div id="InfoSteps" className="text-[.75rem] font-medium text-sub-2.5">
                    <span>{`${stepIndex + 1} / ${totalSteps}`}</span>
                </div>
                <div id="ButtonWrapper" className="flex gap-[.625rem]">
                    {currentStep?.ctaUrl && currentStep?.ctaText ? (
                        <a
                            className="bg-main-1text-white flex h-6 items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 bg-main-1 px-[.375rem] text-[.875rem] font-medium text-white transition-all"
                            href={currentStep.ctaUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {currentStep.ctaText}
                        </a>
                    ) : null}
                    <button
                        className="flex h-6 items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 px-[.375rem] text-[.875rem] font-medium text-main-1 transition-all hover:enabled:bg-main-1 hover:enabled:text-white disabled:border-sub-3 disabled:text-sub-3"
                        onClick={onPrevious}
                        disabled={stepIndex === 0}
                    >
                        이전
                    </button>
                    <button
                        className={twMerge(
                            'flex h-6 items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 px-[.375rem] text-[.875rem] font-medium text-main-1 transition-all hover:enabled:bg-main-1 hover:enabled:text-white disabled:border-sub-3 disabled:text-sub-3',
                            stepIndex === totalSteps - 1 && 'bg-main-1 text-white',
                        )}
                        onClick={onNext}
                    >
                        {stepIndex !== totalSteps - 1 ? '다음' : '완료'}
                    </button>
                </div>
            </div>
        </div>
    );
}
