import {describe, expect, it, vi} from 'vitest';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import PageState from '../index';

vi.mock('react-loading', () => ({
    __esModule: true,
    default: () => <div>spinner</div>,
}));

describe('PageState component', () => {
    it('renders title and description in loading state', () => {
        render(<PageState tone="loading" title="Loading" description="Please wait a moment." />);

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(screen.getByText('Please wait a moment.')).toBeInTheDocument();
    });

    it('executes retry action in error state', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();

        render(<PageState tone="error" title="Something went wrong" action={{label: 'Retry', onClick}} />);

        const button = screen.getByRole('button', {name: 'Retry'});

        expect(button).toHaveClass('h-11', 'rounded-[14px]');

        await user.click(button);

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
