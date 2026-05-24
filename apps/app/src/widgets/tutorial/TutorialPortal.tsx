import {createPortal} from 'react-dom';
import {type ITutorialConfig} from './tutorial.types';
import {TutorialOverlay} from './TutorialOverlay';

type TTutorialPortalProps = {
    open: boolean;
    config: ITutorialConfig;
    closeCallback: () => void;
    initialStepIndex?: number;
};

export function TutorialPortal({open, config, closeCallback, initialStepIndex}: TTutorialPortalProps) {
    const container = document.getElementById('tutorial');

    if (!open || !container) {
        return null;
    }

    return createPortal(<TutorialOverlay config={config} closeCallback={closeCallback} initialStepIndex={initialStepIndex} />, container);
}
