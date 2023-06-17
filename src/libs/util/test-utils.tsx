import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }: { children: JSX.Element }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const customRender = (child: React.ReactElement, options = {}) =>
  render(child, { wrapper, ...options });

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
