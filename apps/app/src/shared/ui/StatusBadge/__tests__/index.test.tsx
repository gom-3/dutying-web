import {describe, expect, it} from 'vitest';
import {render, screen} from '@/shared/util/test-utils';
import StatusBadge from '..';

describe('StatusBadge 컴포넌트', () => {
    it('label과 count를 함께 렌더링해야 함', () => {
        render(<StatusBadge label="반영 대기" count={3} />);

        expect(screen.getByText('반영 대기')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('tone과 size 조합에 맞는 스타일을 적용해야 함', () => {
        render(<StatusBadge label="성공" tone="success" size="md" />);

        expect(screen.getByText('성공').parentElement).toHaveClass('bg-[#F3FFF7]', 'text-[#237548]', 'text-base');
    });
});
