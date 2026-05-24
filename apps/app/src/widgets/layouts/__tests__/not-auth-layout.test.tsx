import {MemoryRouter, Route, Routes} from 'react-router';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import useAuth from '@/features/auth';
import ROUTE from '@/shared/constant/path';
import {render, screen, waitFor} from '@/shared/util/test-utils';
import {NotAuthLayout} from '../not-auth-layout';

vi.mock('@/features/auth', () => ({
    default: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('NotAuthLayout', () => {
    beforeEach(() => {
        mockedUseAuth.mockReset();
    });

    it('redirects authenticated users to make instead of root', async () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
            },
        } as never);

        render(
            <MemoryRouter initialEntries={[ROUTE.LOGIN]}>
                <Routes>
                    <Route element={<NotAuthLayout />}>
                        <Route path={ROUTE.LOGIN} element={<div>login page</div>} />
                    </Route>
                    <Route path={ROUTE.MAKE} element={<div>make page</div>} />
                    <Route path={ROUTE.ROOT} element={<div>root page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('make page')).toBeInTheDocument();
        });

        expect(screen.queryByText('login page')).not.toBeInTheDocument();
        expect(screen.queryByText('root page')).not.toBeInTheDocument();
    });
});
