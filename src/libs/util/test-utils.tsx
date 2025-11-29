import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, type RenderOptions} from '@testing-library/react';
import React from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const wrapper = ({children}: {children: React.ReactNode}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
const customRender = (child: React.ReactNode, options: RenderOptions = {}) => render(child, {wrapper, ...options});

export * from '@testing-library/react';
export {default as userEvent} from '@testing-library/user-event';
export {customRender as render};
