import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

export type TMakeShiftFlowTransition = 'prev' | 'next';

const FLOW_TRANSITION_DELAY_MS = 260;

export function useFlowTransitionFeedback() {
    const {t} = useTypedTranslation();
    const [transitioning, setTransitioning] = useState<TMakeShiftFlowTransition | null>(null);
    const runTransition = useCallback(
        (direction: TMakeShiftFlowTransition, action: () => void) => {
            if (transitioning) return;

            const toastId = `make-shift-flow-transition-${direction}`;

            setTransitioning(direction);
            toast.loading(t('page.makeShift.navigation.moving'), {id: toastId});

            window.setTimeout(() => {
                toast.dismiss(toastId);
                setTransitioning(null);
                action();
            }, FLOW_TRANSITION_DELAY_MS);
        },
        [t, transitioning],
    );

    return {
        transitioning,
        runTransition,
    };
}
