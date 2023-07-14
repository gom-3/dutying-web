import { render } from '@libs/util/test-utils';
import MakeShiftPage from '.';

describe('MakeDutyPage 렌더링 테스트', () => {
  it('충돌 없이 렌더링 된다', () => {
    render(<MakeShiftPage />);
  });
});
