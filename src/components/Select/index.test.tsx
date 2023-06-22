import { render } from '@libs/util/test-utils';
import Select from '.';

describe('Select는', () => {
  it('충돌 없이 렌더링 된다', () => {
    render(<Select />);
  });
});
