import {MemoryRouter, Route, Routes} from 'react-router';
import {describe, expect, it, vi} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import NavigationBar from '..';

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string) =>
            (
                ({
                    'page.navigationBar.expandAria': '사이드바 펼치기',
                    'page.navigationBar.foldAria': '사이드바 접기',
                    'page.navigationBar.home': '근무표',
                    'page.navigationBar.sections.schedule': '근무표',
                    'page.navigationBar.sections.settings': '근무 설정',
                    'page.navigationBar.items.make': '근무표 만들기',
                    'page.navigationBar.items.request': '신청근무 관리',
                    'page.navigationBar.items.member': '근무자 관리',
                    'page.navigationBar.items.wardSettings': '근무 관리',
                    'page.navigationBar.items.account': '계정 관리',
                }) as const
            )[
                key as
                    | 'page.navigationBar.expandAria'
                    | 'page.navigationBar.foldAria'
                    | 'page.navigationBar.home'
                    | 'page.navigationBar.sections.schedule'
                    | 'page.navigationBar.sections.settings'
                    | 'page.navigationBar.items.make'
                    | 'page.navigationBar.items.request'
                    | 'page.navigationBar.items.member'
                    | 'page.navigationBar.items.wardSettings'
                    | 'page.navigationBar.items.account'
            ] ?? key,
    }),
}));

describe('NavigationBar', () => {
    it('설정 섹션에 계정 관리 메뉴를 노출하고 하단 프로필 영역은 렌더링하지 않는다', () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <NavigationBar />
            </MemoryRouter>,
        );

        expect(screen.getByRole('button', {name: '계정 관리'})).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('계정 관리 메뉴를 클릭하면 프로필 페이지로 이동한다', async () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <Routes>
                    <Route
                        path={ROUTE.MAKE}
                        element={
                            <div className="flex">
                                <NavigationBar />
                                <div>make page</div>
                            </div>
                        }
                    />
                    <Route
                        path={ROUTE.PROFILE}
                        element={
                            <div className="flex">
                                <NavigationBar />
                                <div>profile page</div>
                            </div>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('make page')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', {name: '계정 관리'}));

        expect(await screen.findByText('profile page')).toBeInTheDocument();
    });
});
