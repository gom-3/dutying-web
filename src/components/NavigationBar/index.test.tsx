import type ReactRouter from 'react-router';
import { MemoryRouter, Route, Routes } from 'react-router';
import identity from 'lodash-es/identity';
import { describe, expect, vi, it } from 'vitest';
import { fireEvent, render, screen } from '@libs/util/test-utils';
import NavigationBarItem from './NavigationBarItem';
import NavigationBarItemGroups from './NavigationBarItemGroup';
import NavigationBar from '.';

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
  const actual = (await vi.importActual('react-router')) as typeof ReactRouter;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(() => ({
      pathname: '/selected-path',
    })),
  };
});

describe('NavigationBar 컴포넌트', () => {
  it('정상적으로 렌더링되어야 함', () => {
    render(<NavigationBar isFold={false} toggleFold={identity} />);
    expect(screen.getByText('가이드')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('isFold가 true일 때 접힘 상태로 렌더링되어야 함', () => {
    render(<NavigationBar isFold toggleFold={identity} />);
    const navigationBar = screen.getByTestId('navigation-bar');
    expect(navigationBar).toHaveClass('fixed translate-x-[-8rem]');
  });

  it('isFold가 false일 때 펼친 상태로 렌더링되어야 함', () => {
    render(<NavigationBar isFold={false} toggleFold={identity} />);
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
const MockSelectedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} style={{ fill: 'red' }} />;

describe('NavigationBarGroup 컴포넌트', () => {
  it('정상적으로 렌더링되어야 함', () => {
    render(<NavigationBarItemGroups />);
    expect(screen.getByText('근무표 만들기')).toBeInTheDocument();
    expect(screen.getByText('신청 근무 관리')).toBeInTheDocument();
    expect(screen.getByText('간호사 관리')).toBeInTheDocument();
  });

  describe('NavigationBarItem 컴포넌트', () => {
    it('정상적으로 렌더링되고 라우팅되어야 함', async () => {
      const mockPath = '/test-path';
      const mockText = 'Test';
      render(<NavigationBarItem path={mockPath} SelectedIcon={MockSelectedIcon} Icon={MockIcon} text={mockText} />);
      const item = screen.getByText(mockText);
      expect(item).toBeInTheDocument();
      fireEvent.click(item);
      expect(mockNavigate).toHaveBeenCalledWith(mockPath);
    });

    it('선택된 메뉴로 스타일이 변경되어야 함', () => {
      const mockPath = '/selected-path';
      const mockText = 'Selected';
      render(
        <MemoryRouter initialEntries={[mockPath]}>
          <Routes>
            <Route path={mockPath} element={<NavigationBarItem path={mockPath} SelectedIcon={MockSelectedIcon} Icon={MockIcon} text={mockText} />} />
          </Routes>
        </MemoryRouter>
      );
      const item = screen.getByText(mockText);
      expect(item).toHaveClass('text-main-1');
    });
  });
});
