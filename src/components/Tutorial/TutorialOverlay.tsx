import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface TutorialOverlayProps {
  config: StepsConfig;
  closeCallback: () => void;
}

interface ElementStyle {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface StepConfig {
  highlightIds: string[];
  info?: string;
  title?: string;
  infoBoxAlignment?: 'center' | 'left' | 'right';
  ctaUrl?: string;
  ctaText?: string;
  onPrevStep?: () => void;
  onNextStep?: () => void;
}

export interface StepsConfig {
  steps: Map<number, StepConfig>;
  highLightPadding?: number;
  infoBoxHeight?: number;
  infoBoxMargin?: number;
  scrollLock?: boolean;
}

export const TutorialOverlay = ({ config, closeCallback }: TutorialOverlayProps) => {
  const [rectStyles, setRectStyles] = useState<ElementStyle[]>([]);
  const [step, setStep] = useState<number>(1);
  const stepRef = useRef<number>(1);
  stepRef.current = step;
  const currentElements = useRef<{ id: string; element: HTMLElement; initialColor: string }[]>([]);
  const infoBoxElement = useRef<HTMLDivElement>(null);
  const overlayElement = useRef<HTMLDivElement>(null);
  const timeout = useRef<number | undefined>();

  function resetHighlightedElements(): void {
    currentElements.current.forEach((item) => {
      item.element.classList.remove('foreground');
      // item.element.style.backgroundColor = item.initialColor;
    });
    currentElements.current = [];
  }

  /**
   * Find elements in the document with specified IDs and apply config style to them.
   * It should be called after each step change.
   * @returns
   */
  async function setHighlightedElementPositions() {
    const stepConfig = config.steps.get(stepRef.current);
    const elementIds = stepConfig?.highlightIds;
    if (!elementIds) {
      return;
    }
    const positions: ElementStyle[] = [];
    const elements: { id: string; element: HTMLElement; initialColor: string }[] = [];

    // Check if elements for current step are already set.
    const alreadyCalculated = elementIds[0] === currentElements.current[0]?.id;

    if (!alreadyCalculated) {
      //If new elements are found, previous settings should be reset.
      resetHighlightedElements();
    }

    elementIds.forEach((id: string, index: number) => {
      const element: HTMLElement | null = document.getElementById(id);
      if (!element) {
        console.error(`Highlighted element with id ${id} was not found.`);
        return;
      }

      if (!alreadyCalculated) {
        const initialBgColor = window.getComputedStyle(element).backgroundColor;

        // We need initial color when reseting elements. When color is transparent we set it to white
        // for better visibility but after reset we need to revert values.
        elements.push({
          id: id,
          element: element,
          initialColor: initialBgColor,
        });
        element.classList.add('foreground');
      }

      const selectedElPosition: DOMRect = element.getBoundingClientRect();

      if (selectedElPosition) {
        const position: ElementStyle = {
          id: id,
          left: selectedElPosition.left + window.scrollX - 1,
          top: selectedElPosition.top + window.scrollY - 1,
          width: selectedElPosition.width + 2,
          height: selectedElPosition.height + 2,
        };
        positions.push(position);
        //Use position of first element to calculate infoBox
        if (index === 0) {
          calculateInfoBoxPosition(position, stepConfig.infoBoxAlignment);
        }
      }
    });
    if (currentElements.current.length === 0 || !alreadyCalculated) {
      // Set elements to state if current value is empty or elements are not already assigned.
      // The elements should not be assigned twice, because background colors are altered first time and
      // we don't know how to revert them if initial color is not set correctly.
      currentElements.current = elements;
    }

    setRectStyles(positions);
  }

  /**
   * Calculate info box position. It is displayed above or under the element.
   * It depend how much space is left above the element.
   * The box can be aligned center or left baseline of the element.
   * Config also provides box height and vertical margin from the element.
   * @param position Calculated position of first element in the step array.
   * @param alignment Selected alignment of the box.
   */
  function calculateInfoBoxPosition(
    position: ElementStyle,
    alignment?: 'center' | 'left' | 'right'
  ) {
    const boxHeight = config.infoBoxHeight ?? 200;
    const margin = config.infoBoxMargin ?? 30;

    //calculate top
    let newBoxTop = position.top - boxHeight - margin;
    //Check if there is enough space.
    if (newBoxTop < 10) {
      //Set info box under the element.
      newBoxTop = position.top + position.height + margin;
    }
    const el = infoBoxElement.current;
    if (el) {
      let newBoxLeft: number;
      if (alignment === 'left') {
        newBoxLeft = position.left < 10 ? 10 : position.left;
      } else if (alignment === 'right') {
        newBoxLeft = position.left + position.width - el.clientWidth;
      } else {
        newBoxLeft = position.left + position.width / 2;
        const halfOfBoxWidth = el.clientWidth / 2;
        newBoxLeft = newBoxLeft - halfOfBoxWidth < 10 ? 10 + halfOfBoxWidth : newBoxLeft;
      }
      el.style.height = boxHeight + 'px';
      el.style.top = newBoxTop + 'px';
      el.style.left = newBoxLeft + 'px';
      el.style.transform = alignment === 'center' ? 'translate(-50%)' : '';

      const infoContentEl: HTMLElement | null = el.children[0].lastChild as HTMLElement;

      if (infoContentEl) {
        infoContentEl.style.height = `calc(${boxHeight}px - (3rem + 75px))`;
      }

      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }

  /**
   * Advance to next step.
   */
  const nextStep = (): void => {
    if (step === config.steps.size) {
      setStep(1);
      closeCallback();
    } else {
      setStep((oldStep) => oldStep + 1);
    }
    config.steps.get(step)?.onNextStep?.();
  };

  const previousStep = (): void => {
    if (step === 1) {
      return;
    }
    setStep((oldStep) => oldStep - 1);
    config.steps.get(step)?.onPrevStep?.();
  };

  const skip = (): void => {
    setStep(1);
    closeCallback();
  };

  useEffect(() => {
    setHighlightedElementPositions();
  }, [step]);

  useEffect(() => {
    // Disable scrolling if it is selected in config.
    if (config.scrollLock) {
      document.body.style.overflow = 'hidden';
    }

    // Initial calculation. Add some timeout to make sure all elements are already loaded.
    setTimeout(() => {
      setHighlightedElementPositions();
    }, 100);

    window.addEventListener('resize', handleResize);

    function handleResize() {
      // Emulating debounce functionality. Take event only after 250ms.
      clearTimeout(timeout.current);
      timeout.current = window.setTimeout(function () {
        setHighlightedElementPositions();
      }, 250);
    }

    return () => {
      document.body.style.overflow = 'visible';
      resetHighlightedElements();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div
        id="TutorialOverlay"
        className="fixed left-0 top-0 z-[998] h-screen w-screen bg-[#00000020]"
        ref={overlayElement}
      ></div>
      <div
        id="InfoBox"
        className="width-[20rem] absolute top-[6.25rem] z-[999] flex min-h-[7.5rem] flex-col rounded-[.625rem] bg-white p-[1rem] font-apple shadow-[5px_5px_15px_0px_rgba(149,81,146,0.3)]"
        ref={infoBoxElement}
      >
        <div className="flex flex-1 flex-col">
          <div id="InfoTitle" className="flex items-center">
            <p className="truncate text-[1rem] font-semibold text-main-1">
              {config.steps.get(step)?.title}
            </p>
            <button
              className="ml-auto text-[.75rem] font-medium text-main-2 underline underline-offset-[.1rem]"
              onClick={skip}
            >
              건너뛰기
            </button>
          </div>
          <div id="InfoContent" className="mt-[1rem] flex-1 overflow-y-scroll scrollbar-hide">
            {config.steps
              .get(step)
              ?.info?.split('\n')
              .map((x, i) => (
                <p key={i} className="text-[.875rem] font-medium text-sub-1">
                  {x}
                </p>
              ))}
          </div>
        </div>
        <div id="BoxFooter" className="flex items-center justify-between">
          <div id="InfoSteps" className="text-[.75rem] font-medium text-sub-2.5">
            <span>{`${step} / ${config.steps.size}`}</span>
          </div>
          <div id="ButtonWrapper" className="flex gap-[.625rem]">
            {config.steps.get(step)?.ctaUrl && config.steps.get(step)?.ctaText && (
              <a
                className="bg-main-1text-white flex h-[1.5rem] items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 bg-main-1 px-[.375rem] text-[.875rem] font-medium text-white transition-all"
                href={config.steps.get(step)?.ctaUrl}
                target="_blank"
              >
                {config.steps.get(step)?.ctaText}
              </a>
            )}
            <button
              className="flex h-[1.5rem] items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 px-[.375rem] text-[.875rem] font-medium text-main-1 transition-all hover:enabled:bg-main-1 hover:enabled:text-white disabled:border-sub-3 disabled:text-sub-3"
              onClick={previousStep}
              disabled={step === 1}
            >
              이전
            </button>
            <button
              className={twMerge(
                'flex h-[1.5rem] items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 px-[.375rem] text-[.875rem] font-medium text-main-1 transition-all hover:enabled:bg-main-1 hover:enabled:text-white disabled:border-sub-3 disabled:text-sub-3',
                step === config.steps.size && 'bg-main-1 text-white'
              )}
              onClick={nextStep}
            >
              {step !== config.steps.size ? '다음' : '완료'}
            </button>
          </div>
        </div>
      </div>
      {rectStyles.map((style: ElementStyle) => {
        return (
          <div
            style={style}
            id="HighlightedElement"
            className="pointer-events-none absolute z-[999] box-content translate-x-[-.1875rem] translate-y-[-.1875rem] rounded-[.9375rem] border-[.1875rem] border-[#F52FE1]"
            key={style.id}
          ></div>
        );
      })}
    </>
  );
};
