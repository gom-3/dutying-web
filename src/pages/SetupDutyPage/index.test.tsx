import { render } from '@libs/util/test-utils';
import DutySetupPage from '.';

describe('DutySetupPage 렌더링 테스트', () => {
  it('충돌 없이 렌더링 된다', () => {
    render(<DutySetupPage />);
  });
});
