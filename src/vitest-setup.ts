import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import { afterAll, afterEach, beforeAll } from 'vitest';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
