import {MemoryRouter, Route, Routes} from 'react-router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import useAuth from '@/features/auth';
import ROUTE from '@/shared/constant/path';
import {render, screen, waitFor} from '@/shared/util/test-utils';
import useInterval from '@/shared/util/useInterval';
import {AuthLayout} from '../auth-layout';

vi.mock('@/features/auth', () => ({
    default: vi.fn(),
}));

vi.mock('@/shared/util/useInterval', () => ({
    default: vi.fn(),
}));

const translationMap = {
    'feature.auth.demoSession.badge': '체험 계정',
    'feature.auth.demoSession.signupRequired': '회원가입 전환 필요',
    'feature.auth.demoSession.expiringSoon': '곧 만료',
    'feature.auth.demoSession.title': '지금은 체험용 임시 계정으로 근무표를 작성 중이에요.',
    'feature.auth.demoSession.titleExpiringSoon': '체험 종료가 얼마 남지 않았어요.',
    'feature.auth.demoSession.description':
        '체험은 제한 시간이 있는 임시 세션이에요. 계속 사용하려면 체험이 끝나기 전에 회원가입으로 전환해 주세요.',
    'feature.auth.demoSession.descriptionExpiringSoon': '곧 체험이 종료돼요. 이후에도 계속 사용하려면 회원가입 전환이 필요해요.',
    'feature.auth.demoSession.remainingLabel': '남은 시간',
    'feature.auth.demoSession.remainingFallback': '체험 진행 중',
} as const;

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string, values?: Record<string, string | number>) => {
            if (key === 'feature.auth.demoSession.remainingApprox') {
                return `약 ${values?.minutes}분 남음`;
            }

            if (key === 'feature.auth.demoSession.documentTitle') {
                return `체험 ${values?.countdown} | 듀팅`;
            }

            return translationMap[key as keyof typeof translationMap] ?? key;
        },
    }),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseInterval = vi.mocked(useInterval);
const defaultHandleLogout = vi.fn();
const defaultSetDemoExpired = vi.fn();
const defaultStartDemoSignupTransition = vi.fn();

describe('AuthLayout', () => {
    beforeEach(() => {
        defaultHandleLogout.mockReset();
        defaultSetDemoExpired.mockReset();
        defaultStartDemoSignupTransition.mockReset();
        mockedUseInterval.mockReset();
        mockedUseInterval.mockImplementation(() => undefined);
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
                isDemoExpired: false,
                accountMe: {
                    status: 'WARD_SELECT_PENDING',
                },
                demoStartDate: null,
            },
            actions: {
                handleLogout: defaultHandleLogout,
                setDemoExpired: defaultSetDemoExpired,
                startDemoSignupTransition: defaultStartDemoSignupTransition,
            },
        } as never);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('redirects unauthenticated users to login before rendering protected routes', async () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: false,
                isDemoExpired: false,
                accountMe: null,
                demoStartDate: null,
            },
            actions: {
                handleLogout: defaultHandleLogout,
                setDemoExpired: defaultSetDemoExpired,
                startDemoSignupTransition: defaultStartDemoSignupTransition,
            },
        } as never);

        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path={ROUTE.MAKE} element={<div>make page</div>} />
                    </Route>
                    <Route path={ROUTE.LOGIN} element={<div>login page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('login page')).toBeInTheDocument();
        });

        expect(screen.queryByText('make page')).not.toBeInTheDocument();
    });

    it('allows onboarding ward create preview route for onboarding accounts', async () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.ONBOARDING_WARD_CREATE]}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path={ROUTE.ONBOARDING_WARD_CREATE} element={<div>preview page</div>} />
                        <Route path={ROUTE.REGISTER} element={<div>register page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('preview page')).toBeInTheDocument();
        });
        expect(screen.queryByText('register page')).not.toBeInTheDocument();
    });

    it('redirects onboarding accounts away from app routes to register', async () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path={ROUTE.MAKE} element={<div>make page</div>} />
                        <Route path={ROUTE.REGISTER} element={<div>register page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('register page')).toBeInTheDocument();
        });

        expect(screen.queryByText('make page')).not.toBeInTheDocument();
    });

    it('keeps linked accounts on protected app routes', async () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
                isDemoExpired: false,
                accountMe: {
                    status: 'LINKED',
                },
                demoStartDate: null,
            },
            actions: {
                handleLogout: defaultHandleLogout,
                setDemoExpired: defaultSetDemoExpired,
                startDemoSignupTransition: defaultStartDemoSignupTransition,
            },
        } as never);

        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path={ROUTE.MAKE} element={<div>make page</div>} />
                        <Route path={ROUTE.REGISTER} element={<div>register page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText('make page')).toBeInTheDocument();
        });

        expect(screen.queryByText('register page')).not.toBeInTheDocument();
    });

    it('renders a prominent demo session banner with remaining time for demo users', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-03-25T00:00:00.000Z'));

        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
                isDemoExpired: false,
                accountMe: {
                    status: 'DEMO',
                },
                demoStartDate: '2026-03-24T23:31:00.000Z',
            },
            actions: {
                handleLogout: defaultHandleLogout,
                setDemoExpired: defaultSetDemoExpired,
                startDemoSignupTransition: defaultStartDemoSignupTransition,
            },
        } as never);

        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path={ROUTE.MAKE} element={<div>make page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('체험 계정')).toBeInTheDocument();
        expect(screen.getByText('회원가입 전환 필요')).toBeInTheDocument();
        expect(screen.getByText('지금은 체험용 임시 계정으로 근무표를 작성 중이에요.')).toBeInTheDocument();
        expect(screen.getByText('남은 시간')).toBeInTheDocument();
        expect(screen.getByText('30:00')).toBeInTheDocument();
        expect(screen.getByText('약 30분 남음')).toBeInTheDocument();
        expect(mockedUseInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it('marks the demo as expired immediately when the persisted demo start date is malformed', async () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
                isDemoExpired: false,
                accountMe: {
                    status: 'DEMO',
                },
                demoStartDate: 'not-a-date',
            },
            actions: {
                handleLogout: defaultHandleLogout,
                setDemoExpired: defaultSetDemoExpired,
                startDemoSignupTransition: defaultStartDemoSignupTransition,
            },
        } as never);

        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path={ROUTE.MAKE} element={<div>make page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(defaultSetDemoExpired).toHaveBeenCalledWith(true);
        });
    });

    it('opens the demo conversion modal instead of logging out when demo time expires', async () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
                isDemoExpired: true,
                accountMe: {
                    status: 'DEMO',
                },
                demoStartDate: '2026-03-25T00:00:00.000Z',
            },
            actions: {
                handleLogout: defaultHandleLogout,
                setDemoExpired: defaultSetDemoExpired,
                startDemoSignupTransition: defaultStartDemoSignupTransition,
            },
        } as never);

        render(
            <MemoryRouter initialEntries={[ROUTE.MAKE]}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path={ROUTE.MAKE} element={<div>make page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('회원가입하고 이어서 사용')).toBeInTheDocument();
        expect(defaultHandleLogout).not.toHaveBeenCalled();
    });
});
