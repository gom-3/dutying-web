import {type ITutorialConfig} from './tutorial.types';
import {TutorialInfoBox} from './TutorialInfoBox';
import {useTutorialOverlay} from './useTutorialOverlay';

interface ITutorialOverlayProps {
    config: ITutorialConfig;
    closeCallback: () => void;
    initialStepIndex?: number;
}

export const TutorialOverlay = ({config, closeCallback, initialStepIndex}: ITutorialOverlayProps) => {
    const {currentStep, infoBoxElement, nextStep, previousStep, rectStyles, skip, stepIndex, totalSteps} = useTutorialOverlay({
        config,
        closeCallback,
        initialStepIndex,
    });

    return (
        <>
            <div id="TutorialOverlay" className="fixed top-0 left-0 z-998 h-screen w-screen bg-[#00000020]" />
            <TutorialInfoBox
                currentStep={currentStep}
                infoBoxElement={infoBoxElement}
                onNext={nextStep}
                onPrevious={previousStep}
                onSkip={skip}
                stepIndex={stepIndex}
                totalSteps={totalSteps}
            />
            {rectStyles.map((style) => (
                <div
                    key={style.id}
                    id="HighlightedElement"
                    style={style}
                    className="pointer-events-none absolute z-999 box-content translate-x-[-.1875rem] translate-y-[-.1875rem] rounded-[.9375rem] border-[.1875rem] border-[#F52FE1]"
                />
            ))}
        </>
    );
};
