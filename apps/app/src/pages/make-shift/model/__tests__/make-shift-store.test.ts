import {beforeEach, describe, expect, it} from 'vitest';
import {useMakeShiftStore} from '../make-shift-store';

describe('make-shift-store', () => {
    beforeEach(() => {
        window.localStorage.clear();
        useMakeShiftStore.setState({
            phase: 'overview',
            currentStep: 1,
            maxReachedStep: 1,
            restoreDraftModalOpen: false,
            wardId: 1,
            year: 2026,
            month: 6,
            currentShiftTeamId: 10,
            shiftStatus: 'success',
            shiftExists: true,
            shiftFullyAssigned: false,
            confirmedShiftSnapshot: null,
        });
    });

    it('opens the confirmed step when a fully assigned schedule enters the flow', () => {
        useMakeShiftStore.setState({shiftFullyAssigned: true});

        useMakeShiftStore.getState().startFromStep({step: 1, openRestoreDraftModal: true});

        expect(useMakeShiftStore.getState()).toMatchObject({
            phase: 'stepping',
            currentStep: 6,
            maxReachedStep: 6,
            restoreDraftModalOpen: false,
        });
    });
});
