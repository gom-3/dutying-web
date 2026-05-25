import {MemoryRouter, Route, Routes, useLocation} from 'react-router';
import {describe, expect, it} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {render, screen} from '@/shared/util/test-utils';
import DutyPage from '..';

function LocationProbe() {
    const location = useLocation();

    return <div>{`${location.pathname}${location.search}`}</div>;
}

describe('DutyPage', () => {
    it('redirects legacy duty route entries to the make flow with query params intact', async () => {
        render(
            <MemoryRouter initialEntries={['/duty?year=2026&month=6&shiftTeamId=1']}>
                <Routes>
                    <Route path={ROUTE.DUTY} element={<DutyPage />} />
                    <Route path={ROUTE.MAKE} element={<LocationProbe />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('/make?year=2026&month=6&shiftTeamId=1')).toBeInTheDocument();
    });
});
