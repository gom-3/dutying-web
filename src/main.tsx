import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from 'App';
import './index.css';
import initializeApp from 'initializeApp';
import { HackleProvider } from '@hackler/react-sdk';

const { hackleClient } = await initializeApp();
hackleClient.setUserId('test-user-1');

const queryClient = new QueryClient();

const container = document.getElementById('root') as HTMLElement;
const element = (
  <HackleProvider hackleClient={hackleClient}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </HackleProvider>
);
createRoot(container).render(element);
