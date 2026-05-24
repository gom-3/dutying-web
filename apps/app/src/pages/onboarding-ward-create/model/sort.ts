import type {TOnboardingNurseDraft} from './draft';
import type {TSortMode} from './types';

const compareNurseName = (left: TOnboardingNurseDraft, right: TOnboardingNurseDraft) => {
    const byName = left.name.localeCompare(right.name, 'ko-KR', {sensitivity: 'base'});

    if (byName !== 0) {
        return byName;
    }

    return left.id.localeCompare(right.id);
};
const compareNurseSkillLevel = (left: TOnboardingNurseDraft, right: TOnboardingNurseDraft) => {
    const leftLevel = left.level ?? Number.NEGATIVE_INFINITY;
    const rightLevel = right.level ?? Number.NEGATIVE_INFINITY;

    if (rightLevel !== leftLevel) {
        return rightLevel - leftLevel;
    }

    return compareNurseName(left, right);
};

export const sortNursesByMode = (nurses: TOnboardingNurseDraft[], sortMode: TSortMode): TOnboardingNurseDraft[] => {
    const onNurses = nurses.filter((nurse) => nurse.isWorker);
    const offNurses = nurses.filter((nurse) => !nurse.isWorker);

    if (sortMode === 'manual') {
        return [...onNurses, ...offNurses];
    }

    const sortComparator = sortMode === 'name' ? compareNurseName : compareNurseSkillLevel;

    return [...onNurses].sort(sortComparator).concat([...offNurses].sort(sortComparator));
};
