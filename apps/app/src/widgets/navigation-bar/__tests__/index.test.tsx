import {MemoryRouter, Route, Routes} from 'react-router';
import {describe, expect, it, vi} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import NavigationBar from '..';

const translations = {
    'page.navigationBar.ariaLabel': '주요 메뉴',
    'page.navigationBar.expandAria': '사이드바 펼치기',
    'page.navigationBar.foldAria': '사이드바 접기',
    'page.navigationBar.home': '근무표',
    'page.navigationBar.sections.operations': '근무 운영',
    'page.navigationBar.sections.settings': '근무 설정',
    'page.navigationBar.items.make': '근무표',
    'page.navigationBar.items.request': '신청 근무',
    'page.navigationBar.items.board': '게시판',
    'page.navigationBar.items.member': '근무자',
    'page.navigationBar.items.wardSettings': '근무 설정',
    'page.navigationBar.items.account': '계정',
} as const;

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string) => translations[key as keyof typeof translations] ?? key,
    }),
}));

describe('NavigationBar', () => {
    it('상단 근무표 버튼을 제거하고 근무표 메뉴를 하나만 노출한다', () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <NavigationBar />
            </MemoryRouter>,
        );

        expect(screen.getByText('근무 운영')).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: '근무표 만들기'})).not.toBeInTheDocument();
        expect(screen.getAllByRole('button', {name: '근무표'})).toHaveLength(1);
    });

    it('설정 섹션에 계정 메뉴를 노출하고 하단 프로필 영역은 렌더링하지 않는다', () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <NavigationBar />
            </MemoryRouter>,
        );

        expect(screen.getByRole('button', {name: '계정'})).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('계정 메뉴를 클릭하면 프로필 페이지로 이동한다', async () => {
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

        await userEvent.click(screen.getByRole('button', {name: '계정'}));

        expect(await screen.findByText('profile page')).toBeInTheDocument();
    });

    it('사이드바를 접어도 주요 메뉴는 아이콘 버튼으로 남는다', async () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <NavigationBar />
            </MemoryRouter>,
        );

        await userEvent.click(screen.getByRole('button', {name: '사이드바 접기'}));

        expect(screen.getByRole('button', {name: '사이드바 펼치기'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: '게시판'})).toBeInTheDocument();
        expect(screen.queryByText('근무 운영')).not.toBeInTheDocument();
    });

    it('게시판 메뉴를 클릭하면 게시판 페이지로 이동한다', async () => {
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
                        path={ROUTE.BOARD}
                        element={
                            <div className="flex">
                                <NavigationBar />
                                <div>board page</div>
                            </div>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('make page')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', {name: '게시판'}));

        expect(await screen.findByText('board page')).toBeInTheDocument();
    });
});
