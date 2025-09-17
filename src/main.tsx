import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import Loading from '@/components/Loading';
import Tutorial from '@/components/Tutorial';
import App from 'App';
import initializeApp from './initializeApp';
import './index.css';

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
      <Tutorial />
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(container).render(element);
