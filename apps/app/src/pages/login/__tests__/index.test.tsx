import type {ReactNode} from 'react';
import {MemoryRouter, Route, Routes} from 'react-router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {render, screen} from '@/shared/util/test-utils';
import LoginPage from '../index';

vi.mock('react-responsive-carousel', () => ({
    Carousel: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'page.login.title': '로그인',
                'page.login.description': '소셜 계정으로 듀팅을 시작해 보세요.',
                'page.login.kakaoCta': '카카오 계정으로 시작하기',
                'page.login.appleCta': 'Apple 계정으로 시작하기',
                'page.login.termsPrefix': '버튼을 누르면',
                'page.login.termsOfService': '서비스 약관,',
                'page.login.privacyPolicy': '개인정보 취급 방침',
                'page.login.termsSuffix': '에 동의하신 것으로 간주합니다.',
                'page.login.demoExpired.title': '회원가입하고 이어서 사용하기',
                'page.login.demoExpired.description':
                    '체험 시간은 종료되었지만, 지금 가입하면 정식 계정 등록 절차를 바로 시작할 수 있어요.',
                'page.login.demoExpired.bannerTitle': '체험 종료 후 전환 안내',
                'page.login.demoExpired.bannerDescription':
                    '정식 전환 API는 준비 중이라, 이번 단계에서는 로그인 후 회원가입 절차로 연결해 드려요.',
            };

            return translations[key] ?? key;
        },
    }),
}));

describe('LoginPage', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    beforeEach(() => {
        vi.stubEnv('VITE_APP_PUBLIC_URL', 'https://app.dutying.net');
        vi.stubEnv('VITE_SERVER_URL', 'https://api.dutying.net');
    });

    it('shows demo conversion guidance and keeps the requested next path', () => {
        render(
            <MemoryRouter initialEntries={[`${ROUTE.LOGIN}?reason=demo-expired&next=%2Fregister`]}>
                <Routes>
                    <Route path={ROUTE.LOGIN} element={<LoginPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('회원가입하고 이어서 사용하기')).toBeInTheDocument();

        const kakaoLink = screen.getByRole('link', {name: '카카오 계정으로 시작하기'});
        const url = new URL(kakaoLink.getAttribute('href') ?? '');

        expect(url.pathname).toBe('/oauth2/authorization/kakao');
        expect(url.searchParams.get('nextPageUrl')).toBe('https://app.dutying.net/register');
    });
});
