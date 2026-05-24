import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type ITutorialConfig} from '@/widgets/tutorial/tutorial.types';
import MakeTutorial from '../make-tutorial';

const setMakeTutorialMock = vi.fn();
const nextMock = vi.fn();
const prevMock = vi.fn();
const tutorialPortalMock = vi.fn();

let tutorialStoreState = {
    showMakeTutorial: true,
};
let makeShiftStoreState = {
    phase: 'stepping' as 'overview' | 'stepping',
    currentStep: 1,
};

vi.mock('@/features/tutorial/model/store', () => ({
    useTutorialStore: (selector: (state: typeof tutorialStoreState) => unknown) => selector(tutorialStoreState),
}));

vi.mock('@/features/tutorial', () => ({
    default: () => ({
        setMakeTutorial: setMakeTutorialMock,
    }),
}));

vi.mock('@/features/auth', () => ({
    default: () => ({
        state: {accountId: null as number | null},
        actions: {},
    }),
}));

vi.mock('../../model/make-shift-store', () => ({
    useMakeShiftStore: (selector: (state: typeof makeShiftStoreState) => unknown) => selector(makeShiftStoreState),
}));

vi.mock('../../model/make-shift-use-case', () => ({
    useMakeShiftUseCase: () => ({
        next: nextMock,
        prev: prevMock,
    }),
}));

vi.mock('@/widgets/tutorial/TutorialPortal', () => ({
    TutorialPortal: ({
        open,
        config,
        closeCallback,
        initialStepIndex,
    }: {
        open: boolean;
        config: ITutorialConfig;
        closeCallback: () => void;
        initialStepIndex?: number;
    }) => {
        tutorialPortalMock({open, config, closeCallback, initialStepIndex});

        return (
            <div
                data-testid="tutorial-portal"
                data-open={String(open)}
                data-step-count={String(config.steps.length)}
                data-initial-step-index={String(initialStepIndex ?? 0)}
            />
        );
    },
}));

describe('make-tutorial', () => {
    beforeEach(() => {
        tutorialStoreState = {showMakeTutorial: true};
        makeShiftStoreState = {phase: 'stepping', currentStep: 1};
        setMakeTutorialMock.mockReset();
        nextMock.mockReset();
        prevMock.mockReset();
        tutorialPortalMock.mockReset();
    });

    it('opens tutorial only during make stepping phase', () => {
        makeShiftStoreState = {phase: 'overview', currentStep: 1};

        render(<MakeTutorial />);

        expect(screen.getByTestId('tutorial-portal')).toHaveAttribute('data-open', 'false');
    });

    it('builds stepping tutorial config for current make flow', () => {
        render(<MakeTutorial />);

        const portal = screen.getByTestId('tutorial-portal');
        const lastCall = tutorialPortalMock.mock.lastCall?.[0] as {config: ITutorialConfig; open: boolean};

        expect(portal).toHaveAttribute('data-open', 'true');
        expect(portal).toHaveAttribute('data-step-count', '6');
        expect(portal).toHaveAttribute('data-initial-step-index', '0');
        expect(lastCall.open).toBe(true);
        expect(lastCall.config.steps[0]?.highlightIds).toEqual(['make_stepper']);
        expect(lastCall.config.steps[3]?.highlightIds).toEqual(['make_requests_step', 'make_requests_decision_panel']);
        expect(lastCall.config.steps[4]?.highlightIds).toEqual(['make_fixed_shifts_step', 'count_by_day']);
        expect(lastCall.config.steps[5]?.highlightIds).toEqual(['make_ai_autofill_actions']);
    });

    it('aligns tutorial start step with restored make step', () => {
        makeShiftStoreState = {phase: 'stepping', currentStep: 4};

        render(<MakeTutorial />);

        expect(screen.getByTestId('tutorial-portal')).toHaveAttribute('data-initial-step-index', '4');
    });
});
