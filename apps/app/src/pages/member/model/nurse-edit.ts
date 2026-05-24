import {type TNurse} from '@/entities/nurse';
import {type TNurseDrawerMode, type TNurseSaveStatus} from '@/features/edit-shift-team/model/store';

const nurseEditableKeys = ['name', 'gender', 'employmentDate', 'phoneNum', 'isWorker', 'isDutyManager', 'memo'] as const;

export function hasNurseChanges(original: TNurse | null | undefined, draft: TNurse | null | undefined) {
    if (!original || !draft) return false;

    const hasPrimitiveChanges = nurseEditableKeys.some((key) => original[key] !== draft[key]);

    if (hasPrimitiveChanges) return true;

    if (original.nurseShiftTypes.length !== draft.nurseShiftTypes.length) return true;

    return original.nurseShiftTypes.some((shiftType, index) => {
        const draftShiftType = draft.nurseShiftTypes[index];

        if (!draftShiftType) return true;

        return shiftType.nurseShiftTypeId !== draftShiftType.nurseShiftTypeId || shiftType.isPossible !== draftShiftType.isPossible;
    });
}

export function getNurseDrawerFeedback(params: {mode: TNurseDrawerMode; saveStatus: TNurseSaveStatus; isDirty: boolean}) {
    const {mode, saveStatus, isDirty} = params;

    if (saveStatus === 'saving') {
        return {
            title: '저장 중이에요',
            description: '입력한 내용을 반영하고 있어요. 저장이 끝날 때까지 잠시만 기다려 주세요.',
            toneClassName: 'border-main-3 bg-main-light text-main-1',
        };
    }

    if (saveStatus === 'error') {
        return {
            title: '저장하지 못했어요',
            description: '입력한 내용은 그대로 남아 있어요. 내용을 확인한 뒤 다시 저장해 주세요.',
            toneClassName: 'border-red/30 bg-red/5 text-red',
        };
    }

    if (saveStatus === 'success' && !isDirty) {
        return {
            title: '저장을 마쳤어요',
            description: '간호사 정보를 반영했어요. 더 수정할 내용이 없다면 닫아도 괜찮아요.',
            toneClassName: 'border-main-2/20 bg-main-4 text-main-1',
        };
    }

    if (mode === 'create') {
        return {
            title: '새 간호사를 추가했어요',
            description: '기본 정보가 먼저 입력된 상태예요. 이름과 연락처를 확인한 뒤 저장해 주세요.',
            toneClassName: 'border-main-3/60 bg-sub-5 text-sub-1',
        };
    }

    if (isDirty) {
        return {
            title: '변경 사항이 있어요',
        description: '저장하지 않고 닫으면 수정한 내용이 사라져요.',
            toneClassName: 'border-sub-4 bg-main-bg text-sub-1',
        };
    }

    return {
        title: '수정할 항목을 확인해 주세요',
        description: '변경된 내용이 생기면 저장 버튼이 활성화돼요.',
        toneClassName: 'border-sub-4 bg-main-bg text-sub-2',
    };
}
