import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import CreateShiftModal from '../index';

describe('CreateShiftModal', () => {
    beforeEach(() => {
        const modalRoot = document.createElement('div');

        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
    });

    afterEach(() => {
        document.querySelector('#modal-root')?.remove();
    });

    it('shows inline validation instead of alert when required fields are missing', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(<CreateShiftModal open shiftType={null} close={vi.fn()} onSubmit={onSubmit} onDelete={vi.fn()} />);

        await user.click(screen.getByRole('button', {name: '저장'}));

        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByRole('alert')).toHaveTextContent('근무 이름을 입력해 주세요.');
    });

    it('clears work-time validation when switching to leave mode', async () => {
        const user = userEvent.setup();

        render(<CreateShiftModal open shiftType={null} close={vi.fn()} onSubmit={vi.fn()} onDelete={vi.fn()} />);

        const nameInput = screen.getByPlaceholderText('근무 명을 작성해 주세요.');
        const shortNameInput = screen.getAllByRole('textbox')[1];
        const [startTimeInput, endTimeInput] = screen.getAllByDisplayValue('00:00');

        await user.type(nameInput, '데이');
        await user.type(shortNameInput, 'D');
        await user.clear(startTimeInput);
        await user.clear(endTimeInput);
        await user.click(screen.getByRole('button', {name: '저장'}));

        expect(screen.getByRole('alert')).toHaveTextContent('근무 시간을 입력해 주세요.');

        await user.click(screen.getByText('휴가'));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
