import {createPortal} from 'react-dom';
import {match} from 'ts-pattern';
import useEditShiftTeam from '@/features/edit-shift-team';
import useEditWard from '@/features/edit-ward';
import {getConnectionManageTargetLabel} from '../model/connection-manage';
import useConnectionManageController from '../model/use-connection-manage-controller';
import ConnectionManageCompleteStep from './connection-manage/complete-step';
import ConnectionManageMethodStep from './connection-manage/method-step';
import ConnectionManageTargetStep from './connection-manage/target-step';
import ConnectionManageWaitingStep from './connection-manage/waiting-step';

interface IConnectionManageProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

function ConnectionManage({open, setOpen}: IConnectionManageProps) {
    const {
        state: {watingNurses},
        actions: {cancelWaiting, approveWaitingNurses, connectWaitingNurses},
    } = useEditWard();
    const {
        state: {shiftTeams},
    } = useEditShiftTeam();
    const {
        state: {step, currentWaitingNurse, connectMode, toLinkNurseId, toAddShiftTeamId, isNextDisabled, submitStatus},
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
    } = useConnectionManageController({
        open,
        approveWaitingNurses,
        connectWaitingNurses,
    });
    const handleClose = () => setOpen(false);
    const targetLabel = getConnectionManageTargetLabel({
        connectMode,
        shiftTeams,
        toLinkNurseId,
        toAddShiftTeamId,
    });
    const normalizePhone = (phoneNum?: string | null) => (phoneNum ?? '').replace(/\D/g, '');
    const normalizeName = (name?: string | null) => (name ?? '').trim();
    const handleAcceptWaitingNurse = (waitingNurse: (typeof watingNurses)[number]) => {
        const waitingName = normalizeName(waitingNurse.name);
        const allTeamNurses = shiftTeams?.flatMap((shiftTeam) => shiftTeam.nurses) ?? [];
        const hasSameNameNurse = allTeamNurses.some((nurse) => normalizeName(nurse.name) === waitingName);

        handleSelectWaitingNurse(waitingNurse);
        setConnectMode(hasSameNameNurse ? 'link' : 'add');
    };

    return open
        ? createPortal(
              <div
                  className="fixed inset-0 z-[100002] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[1px] [&_button:not(:disabled)]:cursor-pointer"
                  onClick={handleClose}
              >
                  {match(step)
                      .with(0, () => (
                          <ConnectionManageWaitingStep
                              waitingNurses={watingNurses}
                              onClose={handleClose}
                              onAccept={handleAcceptWaitingNurse}
                              onReject={cancelWaiting}
                          />
                      ))
                      .with(1, () => (
                          <ConnectionManageMethodStep
                              currentWaitingNurse={currentWaitingNurse}
                              connectMode={connectMode}
                              onSelectConnectMode={(mode) => {
                                  setConnectMode(mode);
                                  goToTargetSelection();
                              }}
                          />
                      ))
                      .with(2, () => (
                          <ConnectionManageTargetStep
                              currentWaitingNurse={currentWaitingNurse}
                              shiftTeams={shiftTeams}
                              connectMode={connectMode}
                              toLinkNurseId={toLinkNurseId}
                              toAddShiftTeamId={toAddShiftTeamId}
                              isNextDisabled={isNextDisabled}
                              onBack={goToMethodSelection}
                              onNext={handleCompleteSelection}
                              onSelectLinkNurse={setToLinkNurseId}
                              onSelectShiftTeam={setToAddShiftTeamId}
                          />
                      ))
                      .with(3, () => (
                          <ConnectionManageCompleteStep
                              submitStatus={submitStatus}
                              connectMode={connectMode}
                              waitingNurseName={currentWaitingNurse?.name}
                              targetLabel={targetLabel}
                              onRestart={initialize}
                              onBack={goToMethodSelection}
                              onRetry={retryCompleteSelection}
                              onClose={handleClose}
                          />
                      ))
                      .otherwise(() => null)}
              </div>,
              document.getElementById('modal-root')!,
          )
        : null;
}

export default ConnectionManage;
