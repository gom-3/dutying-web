import type {ReactNode} from 'react';
import BaseSectionHeader from '@/shared/ui/SectionHeader';
import type {TOnboardingStep} from '../model';

const STEP_LABELS: Record<TOnboardingStep, {title: string; description: string}> = {
    1: {
        title: '병원명 또는 병동명을 입력해 주세요',
        description: '하나만 입력해도 되고, 둘 다 함께 입력해도 돼요',
    },
    2: {
        title: '이전 근무표 파일이 있다면 업로드해 주세요',
        description: '근무표를 분석해서 간호사 정보와 근무 시간을 자동으로 채워 드릴게요',
    },
    3: {
        title: '병동의 근무 유형을 설정해 주세요',
        description: '나중에도 수정할 수 있어요',
    },
    4: {
        title: '간호사를 등록해 주세요',
        description: '매월 팀당 하나의 근무표를 만들 수 있어요. 언제든 수정, 추가 가능해요',
    },
};

interface ISectionHeaderProps {
    step: TOnboardingStep;
    aside?: ReactNode;
}

function SectionHeader({step, aside}: ISectionHeaderProps) {
    const label = STEP_LABELS[step];

    if (!aside) {
        return <BaseSectionHeader className="mb-10 max-w-[541px]" title={label.title} description={label.description} />;
    }

    return (
        <div className="mb-10 flex items-start justify-between gap-8">
            <BaseSectionHeader className="max-w-[541px]" title={label.title} description={label.description} />
            <div className="shrink-0">{aside}</div>
        </div>
    );
}

export default SectionHeader;
