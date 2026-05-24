import {type TNurse} from '@/entities/nurse';

export function isNurseEditSaveDisabled(selectedNurse: TNurse | null, writeNurse: TNurse | null) {
    return (
        selectedNurse?.name === writeNurse?.name &&
        selectedNurse?.employmentDate === writeNurse?.employmentDate &&
        selectedNurse?.phoneNum === writeNurse?.phoneNum &&
        selectedNurse?.isWorker === writeNurse?.isWorker &&
        selectedNurse?.isDutyManager === writeNurse?.isDutyManager &&
        selectedNurse?.memo === writeNurse?.memo &&
        selectedNurse?.nurseShiftTypes.length === writeNurse?.nurseShiftTypes.length
    );
}
