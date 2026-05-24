import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {describe, expect, it, vi} from 'vitest';
import ROUTE from '@/shared/constant/path';
import Tutorial from '../index';

vi.mock('../MemberTutorial', () => ({
    default: () => <div>member tutorial</div>,
}));

vi.mock('../RequestTutorial', () => ({
    default: () => <div>request tutorial</div>,
}));

describe('Tutorial', () => {
    it('renders member tutorial on member route', () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.MEMBER]}>
                <Tutorial />
            </MemoryRouter>,
        );

        expect(screen.getByText('member tutorial')).toBeInTheDocument();
    });

    it('renders request tutorial on request route', () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.REQUEST]}>
                <Tutorial />
            </MemoryRouter>,
        );

        expect(screen.getByText('request tutorial')).toBeInTheDocument();
    });

    it('renders nothing on unsupported route', () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.DUTY]}>
                <Tutorial />
            </MemoryRouter>,
        );

        expect(screen.queryByText('request tutorial')).not.toBeInTheDocument();
        expect(screen.queryByText('member tutorial')).not.toBeInTheDocument();
    });
});
