import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@/shared/util/test-utils';
import RequestDutyRequestPanel from '../request-duty-request-panel';

const translations: Record<string, string> = {
    'page.request.panel.readonlyTitle': '반영된 신청 근무',
    'page.request.panel.sortOrder': '신청순',
    'page.request.panel.emptyTitleReadonly': '아직 반영된 신청 근무가 없어요',
    'page.request.panel.emptyDescriptionReadonly': '반영된 신청이 생기면 이 패널에서 바로 확인할 수 있어요.',
};

vi.mock('@/entities/shift/ui/shift-badge', () => ({
    default: () => <div>shift-badge</div>,
}));

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string) => translations[key] ?? key,
    }),
}));

describe('RequestDutyRequestPanel', () => {
    it('신청 내역이 없으면 빈 상태를 일관된 PageState로 보여준다', () => {
        render(
            <RequestDutyRequestPanel
                year={2026}
                month={6}
                days={[]}
                dutyRequestList={[]}
                dutyRequestStatus="success"
                wardShiftTypeMap={new Map()}
                canEdit={false}
                updatingRequestId={null}
                shiftNurseIdByNurseId={new Map()}
                changeFocus={vi.fn()}
                acceptRequest={vi.fn().mockResolvedValue(true)}
                acceptRequests={vi.fn().mockResolvedValue(true)}
                retry={vi.fn()}
                onAcceptAnalytics={vi.fn()}
            />,
        );

        expect(screen.getByText('아직 반영된 신청 근무가 없어요')).toBeInTheDocument();
        expect(screen.getByText('반영된 신청이 생기면 이 패널에서 바로 확인할 수 있어요.')).toBeInTheDocument();
    });
});
