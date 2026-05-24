import {describe, expect, it} from 'vitest';
import {render, screen} from '@/shared/util/test-utils';
import Button from '..';

describe('Button 컴포넌트', () => {
    it('정상적으로 렌더링되어야 함', () => {
        render(<Button>테스트 버튼</Button>);
        expect(screen.getByText('테스트 버튼')).toBeInTheDocument();
    });

    it('variant prop이 outline일 때 정상적으로 렌더링되어야 함', () => {
        render(<Button variant="outline">테스트 버튼</Button>);

        const button = screen.getByText('테스트 버튼');

        expect(button).toHaveClass('border-main-1', 'bg-transparent', 'text-main-1');
    });

    it('secondary variant와 md size를 조합할 수 있어야 함', () => {
        render(
            <Button variant="secondary" size="md">
                보조 버튼
            </Button>,
        );

        expect(screen.getByText('보조 버튼')).toHaveClass('bg-gray-6', 'text-gray-3', 'h-9');
    });

    it('디자인 2.0 기본 버튼 스타일을 사용해야 함', () => {
        render(<Button>테스트 버튼</Button>);

        const button = screen.getByText('테스트 버튼');

        expect(button).toHaveClass('rounded-[50px]', 'font-apple', 'text-[2.25rem]', 'bg-main-1');
    });
});
