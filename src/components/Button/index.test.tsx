import { render } from '@libs/util/test-utils';
import Button from '.';

describe('Button은', () => {
  it('충돌 없이 렌더링 된다', () => {
    render(<Button />);
  });
});
