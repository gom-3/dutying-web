import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from 'App';
import './index.css';
import initializeApp from './initializeApp';
import Loading from '@components/Loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

initializeApp();

const container = document.getElementById('root') as HTMLElement;
const element = (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
      <Toaster position="bottom-center" containerClassName="toaster" />
      <Loading />
    </BrowserRouter>
  </QueryClientProvider>
);
createRoot(container).render(element);
