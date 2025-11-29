import {describe, expect, it, vi} from 'vitest';
import {render, screen, userEvent} from '@/libs/util/test-utils';
import TextField from '.';

describe('TextField 컴포넌트', () => {
    it('정상적으로 렌더링되어야 함', () => {
        render(<TextField />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('사용자 입력마다 onChange가 호출되어야 함', async () => {
        const spy = vi.fn();

        render(<TextField onChange={spy} />);

        const input = screen.getByRole('textbox');

        await userEvent.type(input, 'test');
        expect(spy).toHaveBeenCalledTimes(4);
    });

    it('error prop이 주어지면 에러 메세지를 표시해야 함', () => {
        render(<TextField error="error" />);
        expect(screen.getByText('error')).toBeInTheDocument();
    });

    it('error prop이 주어지면 TextField의 외곽선을 빨간색으로 변경해야 함', () => {
        render(<TextField error="error" />);
        expect(screen.getByText('error').previousElementSibling).toHaveClass('outline-red focus:outline-red');
    });
});
