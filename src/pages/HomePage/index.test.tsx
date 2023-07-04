import { render } from '@libs/util/test-utils';
import HomePage from '.';

describe('HomePage 렌더링 테스트', () => {
  it('충돌 없이 렌더링 된다', () => {
    render(<HomePage />);
  });
});
