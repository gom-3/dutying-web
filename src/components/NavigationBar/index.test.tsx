import { fireEvent, render, screen } from '@libs/util/test-utils';
import { describe, expect, vi } from 'vitest';
import NavigationBar from '.';
import { MemoryRouter, Route, Routes } from 'react-router';
import NavigationBarItem from './NavigationBarItem';
import NavigationBarItemGroups from './NavigationBarItemGroup';

const mockNavigate = vi.fn();

vi.mock('@hooks/auth/useAuth', () => ({
  default: vi.fn(() => ({
    state: { accountMe: { name: 'Test User', profileImgBase64: 'base64img' } },
  })),
}));

vi.mock('@hooks/ui/useTutorial', () => ({
  default: vi.fn(() => ({
    actions: { setMakeTutorial: vi.fn(), setMemberTutorial: vi.fn(), setRequestTutorial: vi.fn() },
  })),
}));

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as typeof import('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(() => ({
      pathname: '/selected-path',
    })),
  };
});

describe('NavigationBar', () => {
  it('전체 렌더링', () => {
    render(<NavigationBar isFold={false} setIsFold={() => {}} />);

    expect(screen.getByText('가이드')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('접힘 상태일 때', () => {
    render(<NavigationBar isFold setIsFold={() => {}} />);

    const navigationBar = screen.getByTestId('navigation-bar');
    expect(navigationBar).toHaveClass('fixed translate-x-[-8rem]');
  });

  it('펼침 상태일 때', () => {
    render(<NavigationBar isFold={false} setIsFold={() => {}} />);

    const navigationBar = screen.getByTestId('navigation-bar');
    expect(navigationBar).toHaveClass('sticky');
  });
});

vi.mock('analytics', () => ({
  events: {
    navigationBar: {
      navigate: 'NAVIGATE_EVENT',
    },
  },
  sendEvent: vi.fn(),
}));

const MockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} />;
const MockSelectedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} style={{ fill: 'red' }} />
);

describe('NavigationBarGroup', () => {
  it('기본 렌더링', () => {
    render(<NavigationBarItemGroups />);

    expect(screen.getByText('근무표 만들기')).toBeInTheDocument();
    expect(screen.getByText('신청 근무 관리')).toBeInTheDocument();
    expect(screen.getByText('간호사 관리')).toBeInTheDocument();
  });

  describe('NavigationBarItem', () => {
    it('기본 렌더링과 라우팅 동작', async () => {
      const mockPath = '/test-path';
      const mockText = 'Test';

      render(
        <NavigationBarItem
          path={mockPath}
          SelectedIcon={MockSelectedIcon}
          Icon={MockIcon}
          text={mockText}
        />
      );

      const item = screen.getByText(mockText);
      expect(item).toBeInTheDocument();

      fireEvent.click(item);
      expect(mockNavigate).toHaveBeenCalledWith(mockPath);
    });
    it('선택된 메뉴로 스타일 변경', () => {
      const mockPath = '/selected-path';
      const mockText = 'Selected';

      render(
        <MemoryRouter initialEntries={[mockPath]}>
          <Routes>
            <Route
              path={mockPath}
              element={
                <NavigationBarItem
                  path={mockPath}
                  SelectedIcon={MockSelectedIcon}
                  Icon={MockIcon}
                  text={mockText}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      );

      const item = screen.getByText(mockText);
      expect(item).toHaveClass('text-main-1');
    });
  });
});
