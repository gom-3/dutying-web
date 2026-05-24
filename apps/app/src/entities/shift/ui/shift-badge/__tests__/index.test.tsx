import {describe, vi, expect, beforeEach, it} from 'vitest';
import {type TWardShiftType} from '@/entities/ward';
import {render, screen} from '@/shared/util/test-utils';
import ShiftBadge from '..';

let mockShiftTypeColorStyle = 'background';

vi.mock('@/entities/ui/useUIConfig/store', () => ({
    useUIConfigStore: vi.fn((selector: (state: {shiftTypeColorStyle: string}) => string) =>
        selector({shiftTypeColorStyle: mockShiftTypeColorStyle}),
    ),
}));

const mockShiftType: TWardShiftType = {
    color: 'red',
    shortName: 'A',
    wardShiftTypeId: 1,
    name: '데이',
    startTime: '07:00',
    endTime: '15:00',
    isDefault: true,
    isOff: false,
    isCounted: true,
    classification: 'DAY',
};

describe('ShiftBadge 컴포넌트', () => {
    beforeEach(() => {
        mockShiftTypeColorStyle = 'background';
    });

    it('정상적으로 렌더링되어야 함', () => {
        render(<ShiftBadge shiftType={mockShiftType} />);
        expect(screen.getByText(mockShiftType.shortName)).toBeInTheDocument();
    });

    it('shiftType이 비어있으면 빈칸이 렌더링되어야 함', () => {
        render(<ShiftBadge shiftType={null} />);
        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.getByText('-')).toHaveStyle({
            'background-color': 'rgb(214, 214, 222)',
        });
    });

    it('isOnlyRequest일 때는 불투명하게 렌더링 되어야 함', () => {
        render(<ShiftBadge shiftType={mockShiftType} isOnlyRequest />);
        expect(screen.getByText(mockShiftType.shortName)).toHaveClass('opacity-60');
    });

    it('배경색 모드일 때는 배경 색상이 shiftType의 color이고 글자색은 하얀색이어야 함', () => {
        render(<ShiftBadge shiftType={mockShiftType} />);
        expect(screen.getByText(mockShiftType.shortName)).toHaveStyle({
            backgroundColor: 'rgb(255, 0, 0)',
        });
    });

    it('글자색 모드일 때는 배경 색상이 흰색이고 글자색이 shiftType의 color여야 함', () => {
        mockShiftTypeColorStyle = 'text';
        render(<ShiftBadge shiftType={mockShiftType} />);
        expect(screen.getByText(mockShiftType.shortName)).toHaveStyle({
            backgroundColor: 'rgb(255, 255, 255)',
            color: 'rgb(255, 0, 0)',
        });
    });
});
