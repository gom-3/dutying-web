import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from 'App';
import { worker } from '@mocks/browser';

if (import.meta.env.DEV) {
  await worker.start();
}

const container = document.getElementById('root') as HTMLElement;
const element = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
createRoot(container).render(element);
