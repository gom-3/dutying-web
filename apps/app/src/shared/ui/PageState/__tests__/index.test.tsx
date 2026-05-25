import {describe, expect, it, vi} from 'vitest';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import PageState from '../index';

vi.mock('react-loading', () => ({
    __esModule: true,
    default: () => <div>spinner</div>,
}));

describe('PageState component', () => {
    it('renders spinner only in loading state', () => {
        render(<PageState tone="loading" title="Loading" description="Please wait a moment." />);

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(screen.queryByText('Please wait a moment.')).not.toBeInTheDocument();
    });

    it('renders white loading dots when requested', () => {
        render(<PageState tone="loading" loadingColor="white" title="Loading" />);

        expect(screen.getByRole('status')).toHaveClass('text-white');
    });

    it('executes retry action in error state', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();

        render(<PageState tone="error" title="Something went wrong" action={{label: 'Retry', onClick}} />);

        const button = screen.getByRole('button', {name: 'Retry'});

        expect(button).toHaveClass('px-0', 'text-main-1');

        await user.click(button);

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
