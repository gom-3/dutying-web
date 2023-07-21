import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from 'App';
import './index.css';
import { HackleProvider } from '@hackler/react-sdk';
import { hackleClient } from 'initializeApp';

const queryClient = new QueryClient();

const container = document.getElementById('root') as HTMLElement;
const element = (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HackleProvider hackleClient={hackleClient}>
        <App />
      </HackleProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
createRoot(container).render(element);
