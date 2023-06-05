import { render } from '@libs/utils/test-utils';
import App from 'App';

describe('앱 렌더링 테스트', () => {
  it('App이 충돌 없이 렌더링 된다', () => {
    render(<App />);
  });
});
