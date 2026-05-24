import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import useAuth from '@/features/auth';
import {render, waitFor} from '@/shared/util/test-utils';
import RedirectPage from '../redirect-page';

vi.mock('@/features/auth', () => ({
    default: vi.fn(),
}));

vi.mock('react-loading', () => ({
    __esModule: true,
    default: () => <div>spinner</div>,
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('RedirectPage', () => {
    const handleLogin = vi.fn();

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    beforeEach(() => {
        handleLogin.mockReset();
        mockedUseAuth.mockReset();
        mockedUseAuth.mockReturnValue({
            actions: {
                handleLogin,
            },
        } as never);

        vi.stubEnv('VITE_APP_PUBLIC_URL', 'https://app.dutying.net');
        window.history.replaceState({}, '', '/oauth2/redirect');
    });

    it('falls back when nextPageUrl points to the landing domain', async () => {
        window.history.replaceState(
            {},
            '',
            '/oauth2/redirect?accessToken=test-token&nextPageUrl=https%3A%2F%2Fdutying.net%2Frequest%3Fmonth%3D3',
        );

        render(<RedirectPage />);

        await waitFor(() => {
            expect(handleLogin).toHaveBeenCalledWith('test-token', '/make');
        });
    });

    it('preserves allowed app-domain nextPageUrl for login handler', async () => {
        window.history.replaceState(
            {},
            '',
            '/oauth2/redirect?accessToken=test-token&nextPageUrl=https%3A%2F%2Fapp.dutying.net%2Frequest%3Fmonth%3D3%23calendar',
        );

        render(<RedirectPage />);

        await waitFor(() => {
            expect(handleLogin).toHaveBeenCalledWith('test-token', '/request?month=3#calendar');
        });
    });

    it('does not trigger login without accessToken', () => {
        window.history.replaceState({}, '', '/oauth2/redirect?nextPageUrl=%2Frequest');

        render(<RedirectPage />);

        expect(handleLogin).not.toHaveBeenCalled();
    });
});
