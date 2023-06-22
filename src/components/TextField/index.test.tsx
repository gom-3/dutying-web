import { render } from '@libs/util/test-utils';
import TextField from '.';

describe('TextField는', () => {
  it('충돌 없이 렌더링 된다', () => {
    render(<TextField />);
  });
});
