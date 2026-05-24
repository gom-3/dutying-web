import {useCallback, useEffect, useRef, useState} from 'react';
import {
    type ITutorialConfig,
    type ITutorialHighlightRect,
    type ITutorialStepConfig,
    type TTutorialInfoBoxAlignment,
} from './tutorial.types';

type TUseTutorialOverlayOptions = {
    config: ITutorialConfig;
    closeCallback: () => void;
    initialStepIndex?: number;
};

type THighlightedElement = {
    id: string;
    element: HTMLElement;
};

function getCurrentStep(config: ITutorialConfig, stepIndex: number): ITutorialStepConfig | undefined {
    return config.steps[stepIndex];
}

function normalizeStepIndex(config: ITutorialConfig, stepIndex?: number) {
    if (stepIndex == null) return 0;

    return Math.min(Math.max(stepIndex, 0), Math.max(config.steps.length - 1, 0));
}

export function useTutorialOverlay({config, closeCallback, initialStepIndex}: TUseTutorialOverlayOptions) {
    const normalizedInitialStepIndex = normalizeStepIndex(config, initialStepIndex);
    const [rectStyles, setRectStyles] = useState<ITutorialHighlightRect[]>([]);
    const [stepIndex, setStepIndex] = useState(normalizedInitialStepIndex);
    const stepIndexRef = useRef(normalizedInitialStepIndex);
    const infoBoxElement = useRef<HTMLDivElement>(null);
    const currentElements = useRef<THighlightedElement[]>([]);
    const resizeTimeoutRef = useRef<number | null>(null);
    const currentStep = getCurrentStep(config, stepIndex);
    const totalSteps = config.steps.length;

    useEffect(() => {
        const nextStepIndex = normalizeStepIndex(config, initialStepIndex);

        setStepIndex(nextStepIndex);
        stepIndexRef.current = nextStepIndex;
    }, [config, initialStepIndex]);

    const resetHighlightedElements = useCallback(() => {
        currentElements.current.forEach(({element}) => {
            element.classList.remove('foreground');
        });
        currentElements.current = [];
    }, []);
    const calculateInfoBoxPosition = useCallback(
        (position: ITutorialHighlightRect, alignment?: TTutorialInfoBoxAlignment) => {
            const boxHeight = config.infoBoxHeight ?? 200;
            const margin = config.infoBoxMargin ?? 30;

            let nextTop = position.top - boxHeight - margin;

            if (nextTop < 10) {
                nextTop = position.top + position.height + margin;
            }

            const infoBox = infoBoxElement.current;

            if (!infoBox) return;

            let nextLeft: number;

            if (alignment === 'left') {
                nextLeft = position.left < 10 ? 10 : position.left;
            } else if (alignment === 'right') {
                nextLeft = position.left + position.width - infoBox.clientWidth;
            } else {
                const halfWidth = infoBox.clientWidth / 2;

                nextLeft = position.left + position.width / 2;
                nextLeft = nextLeft - halfWidth < 10 ? 10 + halfWidth : nextLeft;
            }

            infoBox.style.height = `${boxHeight}px`;
            infoBox.style.top = `${nextTop}px`;
            infoBox.style.left = `${nextLeft}px`;
            infoBox.style.transform = alignment === 'center' ? 'translate(-50%)' : '';

            const infoContentElement = infoBox.children[0]?.lastChild as HTMLElement | null;

            if (infoContentElement) {
                infoContentElement.style.height = `calc(${boxHeight}px - (3rem + 75px))`;
            }

            infoBox.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        },
        [config.infoBoxHeight, config.infoBoxMargin],
    );
    const setHighlightedElementPositions = useCallback(() => {
        const step = getCurrentStep(config, stepIndexRef.current);
        const highlightIds = step?.highlightIds;

        if (!highlightIds || highlightIds.length === 0) {
            setRectStyles([]);

            return;
        }

        const positions: ITutorialHighlightRect[] = [];
        const highlightedElements: THighlightedElement[] = [];
        const alreadyCalculated = highlightIds[0] === currentElements.current[0]?.id;

        if (!alreadyCalculated) {
            resetHighlightedElements();
        }

        highlightIds.forEach((id, index) => {
            const element = document.getElementById(id);

            if (!element) {
                console.error(`Highlighted element with id ${id} was not found.`);

                return;
            }

            if (!alreadyCalculated) {
                highlightedElements.push({id, element});
                element.classList.add('foreground');
            }

            const rect = element.getBoundingClientRect();
            const padding = config.highLightPadding ?? 1;
            const position: ITutorialHighlightRect = {
                id,
                left: rect.left + window.scrollX - padding,
                top: rect.top + window.scrollY - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2,
            };

            positions.push(position);

            if (index === 0) {
                calculateInfoBoxPosition(position, step?.infoBoxAlignment);
            }
        });

        if (!alreadyCalculated) {
            currentElements.current = highlightedElements;
        }

        setRectStyles(positions);
    }, [calculateInfoBoxPosition, config, resetHighlightedElements]);
    const skip = useCallback(() => {
        setStepIndex(normalizedInitialStepIndex);
        closeCallback();
    }, [closeCallback, normalizedInitialStepIndex]);
    const previousStep = useCallback(() => {
        if (stepIndex === 0) return;

        currentStep?.onPrevStep?.();
        setStepIndex((prev) => prev - 1);
    }, [currentStep, stepIndex]);
    const nextStep = useCallback(() => {
        currentStep?.onNextStep?.();

        if (stepIndex === totalSteps - 1) {
            setStepIndex(normalizedInitialStepIndex);
            closeCallback();

            return;
        }

        setStepIndex((prev) => prev + 1);
    }, [closeCallback, currentStep, normalizedInitialStepIndex, stepIndex, totalSteps]);

    useEffect(() => {
        stepIndexRef.current = stepIndex;
        setHighlightedElementPositions();
    }, [setHighlightedElementPositions, stepIndex]);

    useEffect(() => {
        if (config.scrollLock) {
            document.body.style.overflow = 'hidden';
        }

        const initialize = window.setTimeout(() => {
            setHighlightedElementPositions();
        }, 100);
        const handleResize = () => {
            if (resizeTimeoutRef.current !== null) {
                window.clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = window.setTimeout(() => {
                setHighlightedElementPositions();
            }, 250);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            document.body.style.overflow = 'visible';
            window.clearTimeout(initialize);

            if (resizeTimeoutRef.current !== null) {
                window.clearTimeout(resizeTimeoutRef.current);
            }

            resetHighlightedElements();
            window.removeEventListener('resize', handleResize);
        };
    }, [config.scrollLock, resetHighlightedElements, setHighlightedElementPositions]);

    return {
        currentStep,
        infoBoxElement,
        nextStep,
        previousStep,
        rectStyles,
        skip,
        stepIndex,
        totalSteps,
    };
}
