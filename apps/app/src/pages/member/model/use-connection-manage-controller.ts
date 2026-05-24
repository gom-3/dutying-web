import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {TWaitingNurse} from '@/entities/nurse';
import type {TConnectionManageStep, TConnectionManageSubmitStatus, TConnectMode} from './connection-manage';

interface IUseConnectionManageControllerParams {
    open: boolean;
    approveWaitingNurses: (waitingNurseId: number, shiftTeamId: number) => Promise<boolean | undefined>;
    connectWaitingNurses: (waitingNurseId: number, nurseId: number) => Promise<boolean | undefined>;
}

function useConnectionManageController({open, approveWaitingNurses, connectWaitingNurses}: IUseConnectionManageControllerParams) {
    const [step, setStep] = useState<TConnectionManageStep>(0);
    const [currentWaitingNurse, setCurrentWaitingNurse] = useState<TWaitingNurse | null>(null);
    const [connectMode, setConnectMode] = useState<TConnectMode>('link');
    const [toLinkNurseId, setToLinkNurseId] = useState<number | null>(null);
    const [toAddShiftTeamId, setToAddShiftTeamId] = useState<number | null>(null);
    const [submitStatus, setSubmitStatus] = useState<TConnectionManageSubmitStatus>('idle');
    const submitRequestIdRef = useRef(0);
    const isActiveSubmitRequest = useCallback((requestId: number) => submitRequestIdRef.current === requestId, []);
    const initialize = useCallback(() => {
        submitRequestIdRef.current += 1;
        setStep(0);
        setCurrentWaitingNurse(null);
        setConnectMode('link');
        setToLinkNurseId(null);
        setToAddShiftTeamId(null);
        setSubmitStatus('idle');
    }, []);
    const goToWaitingList = () => {
        initialize();
    };
    const goToMethodSelection = () => {
        setToLinkNurseId(null);
        setToAddShiftTeamId(null);
        setSubmitStatus('idle');
        setStep(1);
    };
    const goToTargetSelection = () => {
        setSubmitStatus('idle');
        setStep(2);
    };
    const handleSelectWaitingNurse = (waitingNurse: TWaitingNurse) => {
        setConnectMode('link');
        setToLinkNurseId(null);
        setToAddShiftTeamId(null);
        setSubmitStatus('idle');
        setCurrentWaitingNurse(waitingNurse);
        setStep(1);
    };
    const handleAutoConnectWaitingNurse = useCallback(
        async (waitingNurse: TWaitingNurse, matchedNurseId: number) => {
            const requestId = submitRequestIdRef.current + 1;

            submitRequestIdRef.current = requestId;
            setCurrentWaitingNurse(waitingNurse);
            setConnectMode('link');
            setToLinkNurseId(matchedNurseId);
            setToAddShiftTeamId(null);
            setStep(3);
            setSubmitStatus('loading');

            const isSuccess = await connectWaitingNurses(waitingNurse.waitingNurseId, matchedNurseId);

            if (isActiveSubmitRequest(requestId)) {
                setSubmitStatus(isSuccess ? 'success' : 'error');
            }
        },
        [connectWaitingNurses, isActiveSubmitRequest],
    );
    const handleCompleteSelection = useCallback(async () => {
        if (!currentWaitingNurse) return;

        const requestId = submitRequestIdRef.current + 1;

        submitRequestIdRef.current = requestId;
        setStep(3);
        setSubmitStatus('loading');

        if (connectMode === 'link') {
            if (!toLinkNurseId) {
                if (isActiveSubmitRequest(requestId)) {
                    setSubmitStatus('error');
                }

                return;
            }

            const isSuccess = await connectWaitingNurses(currentWaitingNurse.waitingNurseId, toLinkNurseId);

            if (isActiveSubmitRequest(requestId)) {
                setSubmitStatus(isSuccess ? 'success' : 'error');
            }

            return;
        } else {
            if (!toAddShiftTeamId) {
                if (isActiveSubmitRequest(requestId)) {
                    setSubmitStatus('error');
                }

                return;
            }

            const isSuccess = await approveWaitingNurses(currentWaitingNurse.waitingNurseId, toAddShiftTeamId);

            if (isActiveSubmitRequest(requestId)) {
                setSubmitStatus(isSuccess ? 'success' : 'error');
            }
        }
    }, [
        approveWaitingNurses,
        connectMode,
        connectWaitingNurses,
        currentWaitingNurse,
        isActiveSubmitRequest,
        toAddShiftTeamId,
        toLinkNurseId,
    ]);
    const isNextDisabled = useMemo(() => {
        if (!currentWaitingNurse) return true;

        return connectMode === 'link' ? !toLinkNurseId : !toAddShiftTeamId;
    }, [connectMode, currentWaitingNurse, toAddShiftTeamId, toLinkNurseId]);
    const retryCompleteSelection = useCallback(() => {
        void handleCompleteSelection();
    }, [handleCompleteSelection]);

    useEffect(() => {
        if (!open) {
            initialize();
        }
    }, [initialize, open]);

    return {
        state: {
            step,
            currentWaitingNurse,
            connectMode,
            toLinkNurseId,
            toAddShiftTeamId,
            isNextDisabled,
            submitStatus,
        },
        actions: {
            setConnectMode,
            setToLinkNurseId,
            setToAddShiftTeamId,
            initialize,
            goToWaitingList,
            goToMethodSelection,
            goToTargetSelection,
            handleSelectWaitingNurse,
            handleAutoConnectWaitingNurse,
            handleCompleteSelection,
            retryCompleteSelection,
        },
    };
}

export default useConnectionManageController;
