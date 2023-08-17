import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HackleProvider } from '@hackler/react-sdk';
import { hackleClient } from 'initializeApp';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from 'App';
import './index.css';

const queryClient = new QueryClient();

const container = document.getElementById('root') as HTMLElement;
const element = (
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <BrowserRouter>
      <HackleProvider hackleClient={hackleClient}>
        <App />
      </HackleProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
createRoot(container).render(element);
