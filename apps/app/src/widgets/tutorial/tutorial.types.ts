export type TTutorialInfoBoxAlignment = 'center' | 'left' | 'right';

export interface ITutorialStepConfig {
    highlightIds: string[];
    info?: string;
    title?: string;
    infoBoxAlignment?: TTutorialInfoBoxAlignment;
    ctaUrl?: string;
    ctaText?: string;
    onPrevStep?: () => void;
    onNextStep?: () => void;
}

export interface ITutorialConfig {
    steps: ITutorialStepConfig[];
    highLightPadding?: number;
    infoBoxHeight?: number;
    infoBoxMargin?: number;
    scrollLock?: boolean;
}

export interface ITutorialHighlightRect {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
}
