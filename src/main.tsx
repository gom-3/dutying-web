import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import App from 'App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const container = document.getElementById('root') as HTMLElement;
const element = (
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <BrowserRouter>
      <App />
      <Toaster position="bottom-center" containerClassName="toaster" />
    </BrowserRouter>
  </QueryClientProvider>
);
createRoot(container).render(element);
